# 🚀 Gemini MCP Tool - Windows Fixed Version Installation Guide

## 📋 Prerequisites

1. **Node.js** (v16.0.0 or higher)
   ```powershell
   # Check version
   node --version
   npm --version
   ```

2. **Google Gemini CLI**
   ```powershell
   # Install Gemini CLI
   npm install -g @google/generative-ai-cli
   
   # Verify installation
   gemini --version
   ```

3. **Gemini API Key**
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🔧 Installation Methods

### Method 1: NPX (Recommended)

```powershell
# Test the tool
npx -y gemini-mcp-tool-windows-fixed
```

### Method 2: Global Installation

```powershell
# Install globally
npm install -g gemini-mcp-tool-windows-fixed

# Test the tool
gemini-mcp-tool-windows-fixed
```

## ⚙️ MCP Client Configuration

### For Trae AI

1. Open: `%APPDATA%\Trae\User\mcp.json`
2. Add this configuration:

```json
{
  "mcpServers": {
    "gemini-cli": {
      "name": "gemini-cli",
      "description": "Windows-compatible Gemini MCP Tool",
      "baseUrl": "",
      "command": "npx",
      "args": [
        "-y",
        "gemini-mcp-tool-windows-fixed"
      ],
      "env": {
        "GEMINI_API_KEY": "YOUR_ACTUAL_API_KEY_HERE"
      },
      "isActive": true,
      "providerUrl": "https://github.com/your-username/gemini-mcp-tool-windows-fixed"
    }
  }
}
```

### For Claude Desktop

1. Open: `%APPDATA%\Claude\claude_desktop_config.json`
2. Add this configuration:

```json
{
  "mcpServers": {
    "gemini-cli": {
      "command": "npx",
      "args": ["-y", "gemini-mcp-tool-windows-fixed"],
      "env": {
        "GEMINI_API_KEY": "YOUR_ACTUAL_API_KEY_HERE"
      }
    }
  }
}
```

## 🔑 API Key Configuration

### Option 1: MCP Configuration (Recommended)

Replace `YOUR_ACTUAL_API_KEY_HERE` in the configuration above with your actual API key.

### Option 2: Environment Variable

```powershell
# Temporary (current session)
$env:GEMINI_API_KEY = "your-actual-api-key"

# Permanent (user level)
[Environment]::SetEnvironmentVariable("GEMINI_API_KEY", "your-actual-api-key", "User")

# Verify
echo $env:GEMINI_API_KEY
```

## 🧪 Testing Installation

### 1. Test Gemini CLI

```powershell
gemini -p "Hello, how are you?"
```

### 2. Test MCP Tool

```powershell
# Test with NPX
npx -y gemini-mcp-tool-windows-fixed

# Should show: [GMCPT] Gemini CLI MCP Server (Fixed) started
```

### 3. Test MCP Integration

After configuring your MCP client:

1. Restart your MCP client (Trae AI, Claude Desktop)
2. Try asking: "Use gemini to explain what MCP is"
3. Check for successful responses

## 🐛 Troubleshooting

### Common Issues

#### 1. "Command not found: gemini"

```powershell
# Reinstall Gemini CLI
npm uninstall -g @google/generative-ai-cli
npm install -g @google/generative-ai-cli

# Check PATH
echo $env:PATH
```

#### 2. "API key not found"

```powershell
# Check if API key is set
echo $env:GEMINI_API_KEY

# If empty, set it
$env:GEMINI_API_KEY = "your-api-key"
```

#### 3. "Permission denied"

```powershell
# Run as Administrator
# Or check execution policy
Get-ExecutionPolicy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 4. "Module not found"

```powershell
# Clear npm cache
npm cache clean --force

# Reinstall
npm install -g gemini-mcp-tool-windows-fixed
```

### Debug Mode

Enable debug logging:

```json
"env": {
  "GEMINI_API_KEY": "your-key",
  "DEBUG": "true"
}
```

## 📞 Support

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Verify all prerequisites are installed
3. Test each component individually
4. Open an issue with:
   - Windows version
   - PowerShell version
   - Node.js version
   - Complete error logs

## 🎉 Success!

Once everything is working, you should be able to:

- Ask Gemini questions through your MCP client
- Analyze files using `@filename` syntax
- Use sandbox mode for safe code execution
- Leverage Gemini's large context window for complex analysis

---

**Happy coding! 🚀**