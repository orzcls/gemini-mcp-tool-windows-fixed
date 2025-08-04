const { spawn } = require('child_process');

// Simple test to verify PowerShell can be found and executed
function testSimplePowerShell() {
    console.log('Testing simple PowerShell execution...');
    
    // Test 1: Try powershell.exe directly
    console.log('\n=== Test 1: powershell.exe ===');
    const ps1 = spawn('powershell.exe', ['-Command', 'Write-Host "Test 1 Success"'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });
    
    ps1.stdout.on('data', (data) => {
        console.log('✅ STDOUT:', data.toString().trim());
    });
    
    ps1.stderr.on('data', (data) => {
        console.log('❌ STDERR:', data.toString().trim());
    });
    
    ps1.on('error', (error) => {
        if (error.code === 'ENOENT') {
            console.log('❌ ENOENT error: powershell.exe not found');
        } else {
            console.log('❌ Other error:', error.message);
        }
    });
    
    ps1.on('close', (code) => {
        console.log(`Test 1 completed with code: ${code}`);
        
        // Test 2: Try full path
        console.log('\n=== Test 2: Full path ===');
        const ps2 = spawn('C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe', 
            ['-Command', 'Write-Host "Test 2 Success"'], {
            stdio: ['pipe', 'pipe', 'pipe']
        });
        
        ps2.stdout.on('data', (data) => {
            console.log('✅ STDOUT:', data.toString().trim());
        });
        
        ps2.stderr.on('data', (data) => {
            console.log('❌ STDERR:', data.toString().trim());
        });
        
        ps2.on('error', (error) => {
            if (error.code === 'ENOENT') {
                console.log('❌ ENOENT error: Full path PowerShell not found');
            } else {
                console.log('❌ Other error:', error.message);
            }
        });
        
        ps2.on('close', (code) => {
            console.log(`Test 2 completed with code: ${code}`);
            console.log('\n=== Summary ===');
            console.log('If you see "Test 1 Success" or "Test 2 Success" above, PowerShell is working!');
            console.log('If you see ENOENT errors, PowerShell path issues still exist.');
        });
    });
}

// Run the test
testSimplePowerShell();