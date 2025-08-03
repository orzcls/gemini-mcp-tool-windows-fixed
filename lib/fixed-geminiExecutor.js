import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// import { executeCommand } from './package/dist/utils/commandExecutor.js'; // Removed - using built-in spawn
import { spawn } from 'child_process';
// import { Logger } from './package/dist/utils/logger.js'; // Removed - using console instead
import { ERROR_MESSAGES, STATUS_MESSAGES, MODELS, CLI } from './fixed-constants.js';
// import { parseChangeModeOutput, validateChangeModeEdits } from './package/dist/utils/changeModeParser.js'; // Removed - simplified
// import { formatChangeModeResponse, summarizeChangeModeEdits } from './package/dist/utils/changeModeTranslator.js'; // Removed - simplified
// import { chunkChangeModeEdits } from './package/dist/utils/changeModeChunker.js'; // Removed - simplified
// import { cacheChunks, getChunks } from './package/dist/utils/chunkCache.js'; // Removed - simplified

// Simple chunk cache implementation
const chunkCache = new Map();

// Function to get PowerShell executable based on platform
function getPowerShellExecutable() {
    // On Windows, try powershell.exe first (Windows PowerShell), then pwsh (PowerShell Core)
    if (process.platform === 'win32') {
        return 'powershell.exe';
    }
    // On other platforms, use pwsh (PowerShell Core)
    return 'pwsh';
}

const POWERSHELL_EXECUTABLE = getPowerShellExecutable();
console.log(`[GMCPT] Using PowerShell executable: ${POWERSHELL_EXECUTABLE}`);

function cacheChunks(key, chunks) {
    chunkCache.set(key, chunks);
}

function getChunks(key) {
    return chunkCache.get(key) || [];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug: Check if environment variable is loaded
console.log('GEMINI_API_KEY loaded:', process.env.GEMINI_API_KEY ? 'YES' : 'NO');
console.log('Current working directory:', process.cwd());
console.log('Script directory:', __dirname);
console.log('Env file path:', path.join(__dirname, '.env'));

// Custom executeCommand function that accepts custom environment variables
async function executeCommandWithPipedInput(command, input, env, onProgress) {
    return new Promise((resolve, reject) => {
        console.log(`[GMCPT] Executing command with piped input: ${command}`);
        console.log(`[GMCPT] Input length: ${input.length}`);
        console.log(`[GMCPT] GEMINI_API_KEY in env: ${env.GEMINI_API_KEY ? 'YES' : 'NO'}`);
        
        const childProcess = spawn(POWERSHELL_EXECUTABLE, ['-Command', command], {
            env: env,
            stdio: ['pipe', 'pipe', 'pipe']
        });
        
        console.log(`[GMCPT] Spawned process with command: ${POWERSHELL_EXECUTABLE} -Command "${command}"`);
        
        let stdout = '';
        let stderr = '';
        
        // Write input to stdin and close it
        childProcess.stdin.write(input);
        childProcess.stdin.end();
        
        childProcess.stdout.on('data', (data) => {
            stdout += data.toString();
            if (onProgress) {
                onProgress(data.toString());
            }
        });
        
        childProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        childProcess.on('error', (error) => {
            console.log(`[GMCPT] Command execution error: ${error.message}`);
            reject(error);
        });
        
        childProcess.on('close', (code) => {
            console.log(`[GMCPT] Command exited with code: ${code}`);
            console.log(`[GMCPT] stdout length: ${stdout.length}`);
            console.log(`[GMCPT] stderr length: ${stderr.length}`);
            console.log(`[GMCPT] stdout content: ${stdout.substring(0, 500)}...`);
            console.log(`[GMCPT] stderr content: ${stderr.substring(0, 200)}...`);
            if (code === 0) {
                resolve({ stdout, stderr });
            } else {
                reject(new Error(`Command failed with exit code ${code}: ${stderr}`));
            }
        });
    });
}

async function executeCommandWithEnv(command, args, env, onProgress) {
    return new Promise((resolve, reject) => {
        console.log(`[GMCPT] Executing command: ${command} ${args.join(' ')}`);
        console.log(`[GMCPT] Environment variables count: ${Object.keys(env).length}`);
        console.log(`[GMCPT] GEMINI_API_KEY in env: ${env.GEMINI_API_KEY ? 'YES' : 'NO'}`);
        console.log(`Executing with custom env: ${command} ${args.join(' ')}`);
        const psCommand = `& "${command}" ${args.map(arg => `'${arg.replace(/'/g, "''")}'`).join(' ')}`;
        const childProcess = spawn(POWERSHELL_EXECUTABLE, ['-Command', psCommand], {
            env: env,
            stdio: ['pipe', 'pipe', 'pipe']
        });
        
        console.log(`[GMCPT] Executing with PowerShell: ${psCommand}`);
        
        let stdout = '';
        let stderr = '';
        
        childProcess.stdout.on('data', (data) => {
            stdout += data.toString();
            if (onProgress) {
                onProgress(data.toString());
            }
        });
        
        childProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        childProcess.on('error', (error) => {
            console.error(`Command execution error: ${error.message}`);
            reject(error);
        });
        
        childProcess.on('close', (code) => {
            console.log(`[GMCPT] Command exited with code: ${code}`);
            console.log(`[GMCPT] stdout length: ${stdout.length}`);
            console.log(`[GMCPT] stderr length: ${stderr.length}`);
            console.log(`[GMCPT] stdout content: ${stdout.substring(0, 200)}...`);
            console.log(`[GMCPT] stderr content: ${stderr.substring(0, 200)}...`);
            console.log(`Command exited with code: ${code}`);
            if (code === 0) {
                resolve({ stdout, stderr });
            } else {
                reject(new Error(`Command failed with exit code ${code}: ${stderr}`));
            }
        });
    });
}

export async function executeGeminiCLI(prompt, model, sandbox, changeMode, onProgress) {
    console.log('executeGeminiCLI called with prompt: ' + prompt.substring(0, 50) + '...');
    console.log('API Key available: ' + (process.env.GEMINI_API_KEY ? 'YES' : 'NO'));
    let prompt_processed = prompt;
    if (changeMode) {
        prompt_processed = prompt.replace(/file:(\S+)/g, '@$1');
        const changeModeInstructions = `
[CHANGEMODE INSTRUCTIONS]
You are generating code modifications that will be processed by an automated system. The output format is critical because it enables programmatic application of changes without human intervention.

INSTRUCTIONS:
1. Analyze each provided file thoroughly
2. Identify locations requiring changes based on the user request
3. For each change, output in the exact format specified
4. The OLD section must be EXACTLY what appears in the file (copy-paste exact match)
5. Provide complete, directly replacing code blocks
6. Verify line numbers are accurate

CRITICAL REQUIREMENTS:
1. Output edits in the EXACT format specified below - no deviations
2. The OLD string MUST be findable with Ctrl+F - it must be a unique, exact match
3. Include enough surrounding lines to make the OLD string unique
4. If a string appears multiple times (like </div>), include enough context lines above and below to make it unique
5. Copy the OLD content EXACTLY as it appears - including all whitespace, indentation, line breaks
6. Never use partial lines - always include complete lines from start to finish

OUTPUT FORMAT (follow exactly):
**FILE: [filename]:[line_number]**
\`\`\`
OLD:
[exact code to be replaced - must match file content precisely]
NEW:
[new code to insert - complete and functional]
\`\`\`

EXAMPLE 1 - Simple unique match:
**FILE: src/utils/helper.js:100**
\`\`\`
OLD:
function getMessage() {
  return "Hello World";
}
NEW:
function getMessage() {
  return "Hello Universe!";
\`\`\`
`;
        prompt_processed = changeModeInstructions + "\n\n" + prompt_processed;
    }
    
    const args = [];
    
    if (model && model !== MODELS.PRO) {
        args.push(CLI.FLAGS.MODEL, model);
    }
    
    if (sandbox) {
        args.push(CLI.FLAGS.SANDBOX);
    }
    
    args.push(CLI.FLAGS.PROMPT, prompt_processed);
    
    console.log(`Executing: ${CLI.COMMANDS.GEMINI} ${args.join(' ')}`);
    
    try {
        // Create custom environment with GEMINI_API_KEY explicitly set
        const customEnv = {
            ...process.env,
            GEMINI_API_KEY: process.env.GEMINI_API_KEY
        };
        
        console.log('[GMCPT] Using GEMINI_API_KEY: ' + (customEnv.GEMINI_API_KEY ? 'SET' : 'NOT SET'));
        console.log('[GMCPT] Executing gemini command: ' + CLI.COMMANDS.GEMINI + ' ' + args.join(' '));
        
        // Execute gemini command directly with custom environment
        const result = await executeCommandWithEnv(CLI.COMMANDS.GEMINI, args, customEnv, onProgress);
        
        if (changeMode && result.stdout) {
            try {
                // Simple change mode processing - split by lines for chunking
                const lines = result.stdout.split('\n');
                const chunks = [];
                const chunkSize = 50; // lines per chunk
                
                for (let i = 0; i < lines.length; i += chunkSize) {
                    chunks.push(lines.slice(i, i + chunkSize).join('\n'));
                }
                
                if (chunks.length > 1) {
                    const cacheKey = `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    cacheChunks(cacheKey, chunks);
                    
                    return {
                        content: chunks[0],
                        chunk: 1,
                        totalChunks: chunks.length,
                        cacheKey: cacheKey,
                        hasMore: true
                    };
                } else {
                    return {
                        content: result.stdout,
                        chunk: 1,
                        totalChunks: 1,
                        hasMore: false
                    };
                }
            } catch (parseError) {
                console.error(`Failed to parse change mode output: ${parseError.message}`);
                return result.stdout;
            }
        }
        
        return result.stdout;
    } catch (error) {
        console.error(`Gemini CLI execution failed: ${error.message}`);
        throw error;
    }
}

export function getChunkedEdits(cacheKey, chunkIndex) {
    try {
        const chunks = getChunks(cacheKey);
        if (!chunks || chunks.length === 0) {
            throw new Error('No cached chunks found for the provided cache key');
        }
        
        const chunk = chunks[chunkIndex - 1]; // Convert to 0-based index
        if (!chunk) {
            throw new Error(`Chunk ${chunkIndex} not found. Available chunks: 1-${chunks.length}`);
        }
        
        return {
            content: chunk,
            chunk: chunkIndex,
            totalChunks: chunks.length,
            cacheKey: cacheKey,
            hasMore: chunkIndex < chunks.length
        };
    } catch (error) {
        console.error(`Failed to retrieve chunk: ${error.message}`);
        throw error;
    }
}