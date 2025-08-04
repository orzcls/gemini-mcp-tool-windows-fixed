# PowerShell 路径参数更新说明

## 版本信息
- **版本**: 1.0.3
- **发布日期**: 2024年12月
- **更新类型**: 功能增强

## 更新内容

### 新增功能：PowerShell 路径自定义参数

为了解决不同用户系统中 PowerShell 路径不同的问题，我们在 `ask-gemini` 和 `brainstorm` 工具中添加了可选的 `powershellPath` 参数。

### 功能特性

1. **可选参数**: `powershellPath` 是可选参数，不指定时使用系统自动检测
2. **灵活配置**: 支持指定任意有效的 PowerShell 可执行文件路径
3. **向后兼容**: 现有配置无需修改，自动使用默认检测逻辑
4. **多版本支持**: 支持 Windows PowerShell 5.1 和 PowerShell 7+

### 使用方法

#### ask-gemini 工具
```json
{
  "prompt": "你的问题",
  "model": "gemini-pro",
  "powershellPath": "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"
}
```

#### brainstorm 工具
```json
{
  "topic": "创新想法",
  "count": 5,
  "powershellPath": "C:\\Program Files\\PowerShell\\7\\pwsh.exe"
}
```

### 常见 PowerShell 路径

| PowerShell 版本 | 默认路径 |
|----------------|----------|
| Windows PowerShell 5.1 | `C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe` |
| PowerShell 7+ | `C:\\Program Files\\PowerShell\\7\\pwsh.exe` |
| PowerShell Core 6 | `C:\\Program Files\\PowerShell\\6\\pwsh.exe` |

### 技术实现

#### 修改的文件
1. **fixed-mcp-tool.js**: 添加 `powershellPath` 参数定义和传递
2. **fixed-geminiExecutor.js**: 扩展函数支持自定义 PowerShell 路径
   - `getPowerShellExecutable()`: 支持 `customPath` 参数
   - `executeCommandWithEnv()`: 支持 `customPowershellPath` 参数
   - `executeGeminiCLI()`: 添加 `powershellPath` 参数

#### 参数传递流程
```
MCP 工具调用 → fixed-mcp-tool.js → executeGeminiCLI() → executeCommandWithEnv() → spawn(powershellPath)
```

### 日志增强

添加了详细的日志输出，帮助调试 PowerShell 路径问题：
```
[GMCPT] Using PowerShell executable: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
```

### 测试验证

创建了测试脚本 `test-powershell-path.cjs` 来验证功能：
- 测试默认 PowerShell 路径
- 测试自定义 PowerShell 路径
- 验证参数传递正确性

### 安装和更新

#### 从 npm 安装最新版本
```bash
npm install -g gemini-mcp-tool-windows-fixed@1.0.3
```

#### 更新现有安装
```bash
npm update -g gemini-mcp-tool-windows-fixed
```

### 配置示例

#### Claude Desktop 配置
```json
{
  "mcpServers": {
    "gemini-cli": {
      "command": "npx",
      "args": ["-y", "gemini-mcp-tool-windows-fixed@1.0.3"],
      "env": {
        "GEMINI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### Claude Code 配置
```bash
claude mcp add gemini-cli npx -y gemini-mcp-tool-windows-fixed@1.0.3
```

### 故障排除

#### 如果遇到 PowerShell 路径问题
1. 检查系统中安装的 PowerShell 版本
2. 使用 `powershellPath` 参数指定正确路径
3. 查看日志输出确认使用的 PowerShell 路径

#### 常见错误和解决方案
- **ENOENT 错误**: 指定正确的 PowerShell 可执行文件路径
- **权限错误**: 确保 PowerShell 可执行文件有执行权限
- **路径错误**: 使用双反斜杠转义路径中的反斜杠

### 向后兼容性

- ✅ 现有配置无需修改
- ✅ 不指定 `powershellPath` 时使用原有逻辑
- ✅ 所有现有功能保持不变

### 未来计划

- 考虑添加 PowerShell 版本自动检测
- 支持更多 PowerShell 配置选项
- 优化错误提示和调试信息

---

**注意**: 此更新完全向后兼容，现有用户无需修改配置即可继续使用。新的 `powershellPath` 参数仅在需要自定义 PowerShell 路径时使用。