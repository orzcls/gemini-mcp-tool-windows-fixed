import { spawn } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'lib', '.env') });

// Function to get PowerShell executable based on platform
function getPowerShellExecutable() {
    if (process.platform === 'win32') {
        return 'powershell.exe';
    }
    return 'pwsh';
}

const POWERSHELL_EXECUTABLE = getPowerShellExecutable();

// Simulate the exact environment and command used by the MCP tool
async function testMCPPowerShellCall() {
    console.log('=== Testing MCP PowerShell Call ===');
    console.log(`PowerShell executable: ${POWERSHELL_EXECUTABLE}`);
    console.log(`GEMINI_API_KEY loaded: ${process.env.GEMINI_API_KEY ? 'YES' : 'NO'}`);
    
    // Create environment similar to what MCP tool uses
    const env = {
        ...process.env,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY
    };
    
    // Test the exact command pattern used by brainstorm tool
    const testCommand = 'echo "Testing brainstorm command simulation"';
    
    return new Promise((resolve, reject) => {
        console.log(`Executing command: ${POWERSHELL_EXECUTABLE} -Command "${testCommand}"`);
        
        const childProcess = spawn(POWERSHELL_EXECUTABLE, ['-Command', testCommand], {
            env: env,
            stdio: ['pipe', 'pipe', 'pipe']
        });
        
        let stdout = '';
        let stderr = '';
        
        childProcess.stdout.on('data', (data) => {
            stdout += data.toString();
            console.log('stdout chunk:', data.toString().trim());
        });
        
        childProcess.stderr.on('data', (data) => {
            stderr += data.toString();
            console.log('stderr chunk:', data.toString().trim());
        });
        
        childProcess.on('error', (error) => {
            console.log('Process error:', error.message);
            console.log('Error code:', error.code);
            console.log('Error errno:', error.errno);
            console.log('Error syscall:', error.syscall);
            console.log('Error path:', error.path);
            reject(error);
        });
        
        childProcess.on('close', (code) => {
            console.log(`Process exited with code: ${code}`);
            console.log(`Final stdout: ${stdout}`);
            console.log(`Final stderr: ${stderr}`);
            
            if (code === 0) {
                resolve({ stdout, stderr });
            } else {
                reject(new Error(`Command failed with exit code ${code}: ${stderr}`));
            }
        });
        
        // Test with piped input (like the actual MCP tool does)
        const testInput = 'Test input for PowerShell';
        childProcess.stdin.write(testInput);
        childProcess.stdin.end();
    });
}

// Test different PowerShell executable options
async function testDifferentExecutables() {
    const executables = [
        'powershell.exe',
        'powershell',
        'C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
        'pwsh'
    ];
    
    for (const exe of executables) {
        console.log(`\n=== Testing executable: ${exe} ===`);
        
        try {
            const result = await new Promise((resolve, reject) => {
                const proc = spawn(exe, ['-Command', 'echo "Success with ' + exe + '"'], {
                    stdio: ['pipe', 'pipe', 'pipe']
                });
                
                let output = '';
                proc.stdout.on('data', (data) => output += data.toString());
                proc.on('error', reject);
                proc.on('close', (code) => {
                    if (code === 0) {
                        resolve(output.trim());
                    } else {
                        reject(new Error(`Exit code ${code}`));
                    }
                });
            });
            
            console.log(`✅ ${exe}: ${result}`);
        } catch (error) {
            console.log(`❌ ${exe}: ${error.message}`);
        }
    }
}

// Run tests
async function runAllTests() {
    try {
        await testDifferentExecutables();
        console.log('\n' + '='.repeat(50));
        await testMCPPowerShellCall();
        console.log('\n✅ All tests completed successfully');
    } catch (error) {
        console.log('\n❌ Test failed:', error.message);
        console.log('Error details:', error);
    }
}

runAllTests();