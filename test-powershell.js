import { spawn } from 'child_process';

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
console.log(`Testing PowerShell executable: ${POWERSHELL_EXECUTABLE}`);
console.log(`Platform: ${process.platform}`);
console.log(`PATH contains:`, process.env.PATH.split(';').filter(p => p.includes('PowerShell') || p.includes('System32')));

// Test 1: Basic spawn test
console.log('\n=== Test 1: Basic spawn test ===');
const test1 = spawn(POWERSHELL_EXECUTABLE, ['-Command', 'echo "Hello from PowerShell"'], {
    stdio: ['pipe', 'pipe', 'pipe']
});

test1.stdout.on('data', (data) => {
    console.log('Test 1 stdout:', data.toString().trim());
});

test1.stderr.on('data', (data) => {
    console.log('Test 1 stderr:', data.toString().trim());
});

test1.on('error', (error) => {
    console.log('Test 1 error:', error.message);
});

test1.on('close', (code) => {
    console.log('Test 1 exit code:', code);
    
    // Test 2: Full path test
    console.log('\n=== Test 2: Full path test ===');
    const fullPath = 'C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
    const test2 = spawn(fullPath, ['-Command', 'echo "Hello from full path PowerShell"'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });
    
    test2.stdout.on('data', (data) => {
        console.log('Test 2 stdout:', data.toString().trim());
    });
    
    test2.stderr.on('data', (data) => {
        console.log('Test 2 stderr:', data.toString().trim());
    });
    
    test2.on('error', (error) => {
        console.log('Test 2 error:', error.message);
    });
    
    test2.on('close', (code) => {
        console.log('Test 2 exit code:', code);
        
        // Test 3: Environment test
        console.log('\n=== Test 3: Environment test ===');
        const test3 = spawn(POWERSHELL_EXECUTABLE, ['-Command', '$env:PATH -split ";" | Where-Object { $_ -like "*PowerShell*" -or $_ -like "*System32*" }'], {
            stdio: ['pipe', 'pipe', 'pipe']
        });
        
        test3.stdout.on('data', (data) => {
            console.log('Test 3 stdout:', data.toString().trim());
        });
        
        test3.stderr.on('data', (data) => {
            console.log('Test 3 stderr:', data.toString().trim());
        });
        
        test3.on('error', (error) => {
            console.log('Test 3 error:', error.message);
        });
        
        test3.on('close', (code) => {
            console.log('Test 3 exit code:', code);
            console.log('\n=== All tests completed ===');
        });
    });
});