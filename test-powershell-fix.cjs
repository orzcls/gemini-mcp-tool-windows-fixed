const { spawn } = require('child_process');
const path = require('path');

// Test PowerShell execution directly
function testPowerShellFix() {
    console.log('Testing PowerShell execution fix...');
    
    // Import the fixed executor
    const executorPath = path.join(__dirname, 'lib', 'fixed-geminiExecutor.js');
    
    // Test simple PowerShell command
    const testCommand = 'Write-Host "PowerShell test successful"';
    
    console.log('Testing PowerShell command execution...');
    
    const childProcess = spawn('node', ['-e', `
        import('${executorPath.replace(/\\/g, '/')}')
        .then(module => {
            return module.executeCommandWithPipedInput('${testCommand}', { TEST: 'value' });
        })
        .then(result => {
            console.log('SUCCESS: PowerShell command executed');
            console.log('STDOUT:', result.stdout);
            console.log('STDERR:', result.stderr);
        })
        .catch(error => {
            console.error('ERROR:', error.message);
            if (error.message.includes('ENOENT')) {
                console.error('ENOENT error still present!');
            } else {
                console.log('No ENOENT error - PowerShell found successfully');
            }
        });
    `], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: process.env
    });
    
    let stdout = '';
    let stderr = '';
    
    childProcess.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log('STDOUT:', data.toString().trim());
    });
    
    childProcess.stderr.on('data', (data) => {
        stderr += data.toString();
        console.log('STDERR:', data.toString().trim());
    });
    
    childProcess.on('error', (error) => {
        console.error('Process error:', error.message);
    });
    
    childProcess.on('close', (code) => {
        console.log(`\nTest completed with exit code: ${code}`);
        
        if (stderr.includes('ENOENT')) {
            console.log('❌ ENOENT error still present');
        } else if (stdout.includes('PowerShell test successful') || stdout.includes('SUCCESS')) {
            console.log('✅ PowerShell execution successful - ENOENT error fixed!');
        } else {
            console.log('⚠️  Test completed but results unclear');
        }
    });
}

// Run the test
testPowerShellFix();

console.log('PowerShell fix test started...');