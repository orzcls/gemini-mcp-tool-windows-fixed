const { spawn } = require('child_process');
const path = require('path');

// Test the new powershellPath parameter functionality
const testPowershellPath = async () => {
    console.log('Testing PowerShell path parameter functionality...');
    
    // Test 1: Using default PowerShell path
    console.log('\n=== Test 1: Default PowerShell path ===');
    const test1 = spawn('node', ['index.js'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Send MCP request for brainstorm without powershellPath
    const mcpRequest1 = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
            name: 'brainstorm',
            arguments: {
                topic: 'test topic',
                count: 1
            }
        }
    };
    
    test1.stdin.write(JSON.stringify(mcpRequest1) + '\n');
    test1.stdin.end();
    
    let output1 = '';
    let error1 = '';
    
    test1.stdout.on('data', (data) => {
        output1 += data.toString();
    });
    
    test1.stderr.on('data', (data) => {
        error1 += data.toString();
    });
    
    await new Promise((resolve) => {
        test1.on('close', (code) => {
            console.log(`Test 1 exit code: ${code}`);
            console.log('Test 1 output:', output1.substring(0, 200) + '...');
            if (error1) {
                console.log('Test 1 error:', error1.substring(0, 200) + '...');
            }
            resolve();
        });
    });
    
    // Test 2: Using custom PowerShell path
    console.log('\n=== Test 2: Custom PowerShell path ===');
    const test2 = spawn('node', ['index.js'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Send MCP request for brainstorm with custom powershellPath
    const mcpRequest2 = {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
            name: 'brainstorm',
            arguments: {
                topic: 'test topic with custom path',
                count: 1,
                powershellPath: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe'
            }
        }
    };
    
    test2.stdin.write(JSON.stringify(mcpRequest2) + '\n');
    test2.stdin.end();
    
    let output2 = '';
    let error2 = '';
    
    test2.stdout.on('data', (data) => {
        output2 += data.toString();
    });
    
    test2.stderr.on('data', (data) => {
        error2 += data.toString();
    });
    
    await new Promise((resolve) => {
        test2.on('close', (code) => {
            console.log(`Test 2 exit code: ${code}`);
            console.log('Test 2 output:', output2.substring(0, 200) + '...');
            if (error2) {
                console.log('Test 2 error:', error2.substring(0, 200) + '...');
            }
            resolve();
        });
    });
    
    console.log('\n=== PowerShell Path Parameter Test Complete ===');
    console.log('Both tests should show PowerShell executable paths in the logs.');
};

testPowershellPath().catch(console.error);