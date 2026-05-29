---
name: browser-cdp
description: 浏览器CDP自动化。控制Chrome浏览器复用已有登录态，用于抓取平台榜单数据。触发：浏览器操作、CDP、抓取榜单。
runAs: subagent
---
# Browser CDP 操作工具

通过 CDP 协议控制 Chrome，复用已有登录态，执行浏览器自动化操作。

## 前置条件

- Windows / macOS / Linux，已安装 Google Chrome
- Node.js 16+
- `agent-browser` 命令行工具已安装（`npm install -g agent-browser`）

## 第一步：启动 CDP Chrome 环境

```bash
node .agents/skills/browser-cdp/scripts/setup-cdp-chrome.js 9222
```

成功后所有 `agent-browser` 命令带 `--cdp 9222`。

## 常用操作

### 打开页面并等待加载

```bash
agent-browser --cdp 9222 open "<URL>"
agent-browser --cdp 9222 wait 3000
```

### 提取页面文本内容

```bash
agent-browser --cdp 9222 eval 'document.body.innerText.substring(0, 8000)'
```

### 提取 Auth Token

```bash
agent-browser --cdp 9222 eval 'localStorage.getItem("token") || document.cookie'
```

### 页面截图 / 交互式快照

```bash
agent-browser --cdp 9222 snapshot -i
```

### 点击元素

```bash
agent-browser --cdp 9222 click "<CSS selector>"
```

### 填写表单

```bash
agent-browser --cdp 9222 type "<CSS selector>" "<text>"
```

## 常见问题

| 问题 | 解决方案 |
|------|----------|
| CDP 端口未监听 | 重新运行 `setup-cdp-chrome.js` |
| 页面跳转到登录页 | `snapshot -i` 找登录按钮并操作 |
| eval 返回 null | 检查 localStorage key 名称，或改用 `document.cookie` |
| Chrome 进程残留 | macOS/Linux: `pkill -9 -x 'Google Chrome'` / Windows: `taskkill /F /IM chrome.exe` |

## 各平台采集脚本

项目自带的采集脚本位于 `.agents/skills/` 下各 skill 目录：
- 起点榜单：`story-long-scan/scripts/qidian-rank-scraper.js`
- 番茄榜单：`story-long-scan/scripts/fanqie-rank-scraper.js`
- 七猫榜单：`story-long-scan/scripts/qimao-rank-scraper.js`
- 晋江榜单：`story-long-scan/scripts/jjwxc-rank-scraper.js`
- 刺猬猫：`story-long-scan/scripts/ciweimao-rank-scraper.js`
- 点众短篇：`story-short-scan/scripts/dz-browse-scraper.js`
- 黑岩短篇：`story-short-scan/scripts/heiyan-booklist-scraper.js`
