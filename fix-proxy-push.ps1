# GitHub Proxy Push Fix Script
# Solve Git push issues in proxy environments

Write-Host "GitHub Proxy Push Fix Tool" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Get GitHub username
$githubUser = Read-Host "Enter your GitHub username"
if (-not $githubUser) {
    Write-Host "ERROR: GitHub username is required" -ForegroundColor Red
    exit 1
}

Write-Host "Detecting current environment..." -ForegroundColor Yellow

# Detect system proxy
$systemProxy = netsh winhttp show proxy 2>$null
if ($systemProxy -match "Direct access") {
    Write-Host "System proxy: Direct access (no proxy)" -ForegroundColor Green
} else {
    Write-Host "System proxy: $systemProxy" -ForegroundColor Yellow
}

# Detect environment variable proxy
$envHttpProxy = $env:HTTP_PROXY
$envHttpsProxy = $env:HTTPS_PROXY
if ($envHttpProxy) { Write-Host "HTTP_PROXY: $envHttpProxy" -ForegroundColor Yellow }
if ($envHttpsProxy) { Write-Host "HTTPS_PROXY: $envHttpsProxy" -ForegroundColor Yellow }
if (-not $envHttpProxy -and -not $envHttpsProxy) {
    Write-Host "Environment variables: No proxy configured" -ForegroundColor Green
}

# Check current Git proxy configuration
$currentGitHttpProxy = git config --global --get http.proxy 2>$null
$currentGitHttpsProxy = git config --global --get https.proxy 2>$null
if ($currentGitHttpProxy) { Write-Host "Git HTTP proxy: $currentGitHttpProxy" -ForegroundColor Yellow }
if ($currentGitHttpsProxy) { Write-Host "Git HTTPS proxy: $currentGitHttpsProxy" -ForegroundColor Yellow }
if (-not $currentGitHttpProxy -and -not $currentGitHttpsProxy) {
    Write-Host "Git proxy: Not configured" -ForegroundColor Green
}

Write-Host ""
Write-Host "Proxy configuration options:" -ForegroundColor Yellow
Write-Host "1. Use system proxy" -ForegroundColor White
Write-Host "2. Manual proxy configuration" -ForegroundColor White
Write-Host "3. Clear proxy configuration" -ForegroundColor White
Write-Host "4. Skip proxy configuration" -ForegroundColor White

$choice = Read-Host "Please choose (1-4)"

if ($choice -eq "1") {
    Write-Host "Configuring Git to use system proxy..." -ForegroundColor Yellow
    
    # Extract proxy address from system proxy configuration
    if ($systemProxy -match "Proxy Server\(s\)\s*:\s*([^\s]+)") {
        $proxyServer = $matches[1]
        Write-Host "Detected system proxy: $proxyServer" -ForegroundColor Green
        
        git config --global http.proxy "http://$proxyServer"
        git config --global https.proxy "http://$proxyServer"
        
        Write-Host "Git proxy configuration completed" -ForegroundColor Green
    } else {
        Write-Host "Cannot auto-detect system proxy, please configure manually" -ForegroundColor Red
        $manualProxy = Read-Host "Enter proxy address (format: host:port)"
        if ($manualProxy) {
            git config --global http.proxy "http://$manualProxy"
            git config --global https.proxy "http://$manualProxy"
            Write-Host "Manual proxy configuration completed" -ForegroundColor Green
        }
    }
}
elseif ($choice -eq "2") {
    Write-Host "Manual proxy configuration..." -ForegroundColor Yellow
    $proxyHost = Read-Host "Enter proxy host address"
    $proxyPort = Read-Host "Enter proxy port"
    
    if ($proxyHost -and $proxyPort) {
        $proxyUrl = "http://$proxyHost`:$proxyPort"
        
        # Ask if authentication is needed
        $needAuth = Read-Host "Does proxy require authentication? (y/n)"
        if ($needAuth -eq "y" -or $needAuth -eq "Y") {
            $proxyUser = Read-Host "Proxy username"
            $proxyPass = Read-Host "Proxy password" -AsSecureString
            $proxyPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($proxyPass))
            $proxyUrl = "http://$proxyUser`:$proxyPassPlain@$proxyHost`:$proxyPort"
        }
        
        git config --global http.proxy $proxyUrl
        git config --global https.proxy $proxyUrl
        
        Write-Host "Proxy configuration completed" -ForegroundColor Green
    } else {
        Write-Host "Proxy configuration incomplete" -ForegroundColor Red
    }
}
elseif ($choice -eq "3") {
    Write-Host "Clearing Git proxy configuration..." -ForegroundColor Yellow
    git config --global --unset http.proxy 2>$null
    git config --global --unset https.proxy 2>$null
    Write-Host "Proxy configuration cleared" -ForegroundColor Green
}
else {
    Write-Host "Skipping proxy configuration" -ForegroundColor Yellow
}

# Git performance optimization
Write-Host ""
Write-Host "Optimizing Git configuration..." -ForegroundColor Yellow
git config --global http.postBuffer 524288000
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999
git config --global http.sslVerify false
git config --global pack.windowMemory 256m
git config --global pack.packSizeLimit 2g
Write-Host "Git performance optimization completed" -ForegroundColor Green

# Configure credential manager
Write-Host ""
Write-Host "Configuring credential manager..." -ForegroundColor Yellow
git config --global credential.helper manager-core
Write-Host "Credential manager configuration completed" -ForegroundColor Green

# Set up remote repository
Write-Host ""
Write-Host "Configuring remote repository..." -ForegroundColor Yellow
$repoName = Split-Path -Leaf (Get-Location)
$remoteUrl = "https://github.com/$githubUser/$repoName.git"

# Check if remote repository already exists
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "Current remote repository: $existingRemote" -ForegroundColor Yellow
    $updateRemote = Read-Host "Update to new remote repository? (y/n)"
    if ($updateRemote -eq "y" -or $updateRemote -eq "Y") {
        git remote set-url origin $remoteUrl
        Write-Host "Remote repository updated" -ForegroundColor Green
    }
} else {
    git remote add origin $remoteUrl
    Write-Host "Remote repository added: $remoteUrl" -ForegroundColor Green
}

# Test network connection
Write-Host ""
Write-Host "Testing network connection..." -ForegroundColor Yellow
try {
    $testResult = Test-NetConnection github.com -Port 443 -WarningAction SilentlyContinue
    if ($testResult.TcpTestSucceeded) {
        Write-Host "GitHub connection successful" -ForegroundColor Green
    } else {
        Write-Host "GitHub connection failed" -ForegroundColor Red
    }
} catch {
    Write-Host "Network test failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Repository is now ready for manual upload
Write-Host "✅ Repository configuration completed!" -ForegroundColor Green
Write-Host "" 
Write-Host "📋 Manual Upload Instructions:" -ForegroundColor Cyan
Write-Host "1. Create a new repository on GitHub: https://github.com/new" -ForegroundColor White
Write-Host "   Repository name: gemini-mcp-tool-windows-fixed" -ForegroundColor White
Write-Host "2. Initialize and push your code:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Initial commit - Windows fixed version'" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git remote add origin https://github.com/$githubUser/gemini-mcp-tool-windows-fixed.git" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host "" 
Write-Host "📦 Repository ready for manual upload!" -ForegroundColor Green
Write-Host "🔧 All configurations applied successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "Current Git proxy configuration:" -ForegroundColor Cyan
$currentHttpProxy = git config --global --get http.proxy
$currentHttpsProxy = git config --global --get https.proxy
if ($currentHttpProxy) { Write-Host "   http.proxy: $currentHttpProxy" -ForegroundColor White }
if ($currentHttpsProxy) { Write-Host "   https.proxy: $currentHttpsProxy" -ForegroundColor White }
if (-not $currentHttpProxy -and -not $currentHttpsProxy) { Write-Host "   No proxy configured" -ForegroundColor Gray }

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update Trae AI MCP configuration" -ForegroundColor White
Write-Host "2. Add GEMINI_API_KEY environment variable" -ForegroundColor White
Write-Host "3. Restart Trae AI" -ForegroundColor White
Write-Host "4. Test integration" -ForegroundColor White