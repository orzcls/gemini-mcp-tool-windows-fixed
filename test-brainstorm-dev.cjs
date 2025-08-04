const { spawn } = require('child_process');
const path = require('path');

// Test the local development version of MCP tool
function testBrainstormDev() {
    console.log('Testing brainstorm functionality with local development version...');
    
    // Create a test MCP request for brainstorm
    const mcpRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
            name: 'brainstorm',
            arguments: {
                prompt: '如何提高团队协作效率',
                model: 'gemini-1.5-flash',
                methodology: 'structured',
                domain: 'business',
                ideaCount: 3
            }
        }
    };
    
    const mcpToolPath = path.join(__dirname, 'lib', 'fixed-mcp-tool.js');
    console.log(`Using MCP tool at: ${mcpToolPath}`);
    
    const childProcess = spawn('node', [mcpToolPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
            ...process.env,
            GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'test_key'
        }
    });
    
    let stdout = '';
    let stderr = '';
    
    childProcess.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log('STDOUT:', data.toString());
    });
    
    childProcess.stderr.on('data', (data) => {
        stderr += data.toString();
        console.log('STDERR:', data.toString());
    });
    
    childProcess.on('error', (error) => {
        console.error('Process error:', error.message);
    });
    
    childProcess.on('close', (code) => {
        console.log(`Process exited with code: ${code}`);
        console.log('=== FINAL STDOUT ===');
        console.log(stdout);
        console.log('=== FINAL STDERR ===');
        console.log(stderr);
    });
    
    // Send the MCP request
    console.log('Sending MCP request:', JSON.stringify(mcpRequest, null, 2));
    childProcess.stdin.write(JSON.stringify(mcpRequest) + '\n');
    
    // Wait a bit then close stdin
    setTimeout(() => {
        childProcess.stdin.end();
    }, 1000);
}

// Run the test
testBrainstormDev();

console.log('Test started. Check output above for results.');