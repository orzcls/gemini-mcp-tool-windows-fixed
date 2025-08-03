# 🚀 Gemini MCP Tool - Windows Fixed Version Installation Guide

> **最新版本 v1.0.2** - 修复了 PowerShell 执行错误，解决了 `spawn powershell.exe ENOENT` 问题

## 🆕 版本更新日志

### v1.0.2 (最新)
- ✅ **修复 PowerShell 执行错误** - 解决 `spawn powershell.exe ENOENT` 问题
- ✅ **改进 Windows 兼容性** - 自动检测可用的 PowerShell 版本
- ✅ **修复未定义变量错误** - 修复 `executeCommandWithPipedInput` 函数中的 `args` 变量问题
- ✅ **增强错误处理** - 更好的错误信息和调试输出

### v1.0.1
- 基础 Windows 兼容性修复

### v1.0.0
- 初始版本

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
# 使用最新版本 (推荐)
npx gemini-mcp-tool-windows-fixed@1.0.2

# 或者使用最新版本标签
npx -y gemini-mcp-tool-windows-fixed@latest
```

### Method 2: Global Installation

```powershell
# 安装最新版本
npm install -g gemini-mcp-tool-windows-fixed@1.0.2

# 测试工具
gemini-mcp-tool-windows-fixed
```

### Method 3: 更新现有安装

如果您之前安装了旧版本，请先更新：

```powershell
# 卸载旧版本
npm uninstall -g gemini-mcp-tool-windows-fixed

# 清除缓存
npm cache clean --force

# 安装最新版本
npm install -g gemini-mcp-tool-windows-fixed@1.0.2
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
        "gemini-mcp-tool-windows-fixed@1.0.2"
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
      "args": ["-y", "gemini-mcp-tool-windows-fixed@1.0.2"],
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
npm install -g gemini-mcp-tool-windows-fixed@1.0.2
```

#### 5. "spawn powershell.exe ENOENT" 错误

这个错误在 v1.0.2 中已修复。如果仍然遇到此错误：

```powershell
# 确保使用最新版本
npm uninstall -g gemini-mcp-tool-windows-fixed
npm cache clean --force
npm install -g gemini-mcp-tool-windows-fixed@1.0.2

# 或使用 npx
npx gemini-mcp-tool-windows-fixed@1.0.2
```

**原因：** 旧版本 (v1.0.0, v1.0.1) 存在 PowerShell 执行路径问题
**解决方案：** 更新到 v1.0.2 或更高版本

#### 6. PowerShell 版本兼容性

工具会自动检测可用的 PowerShell 版本：
- Windows PowerShell (powershell.exe)
- PowerShell Core (pwsh)

如果遇到问题，请确保至少安装了其中一个版本。

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