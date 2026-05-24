# novel — 网文写作工具集

## Skill 路由表

| 命令 | Skill | 说明 |
|------|-------|------|
| `/story-long-write`、`/写长篇` | story-long-write | 长篇网文写作（逐章推进） |
| `/story-short-write`、`/写短篇` | story-short-write | 短篇网文写作（情绪驱动） |
| `/story-long-analyze`、`/长篇拆文` | story-long-analyze | 长篇小说深度拆解 |
| `/story-short-analyze`、`/短篇拆文` | story-short-analyze | 短篇小说拆文分析 |
| `/story-long-scan`、`/长篇扫描` | story-long-scan | 长篇小说批量扫描 |
| `/story-short-scan`、`/短篇扫描` | story-short-scan | 短篇小说批量扫描 |
| `/story-deslop`、`/去AI味` | story-deslop | 去除 AI 写作痕迹 |
| `/story-cover`、`/封面` | story-cover | 生成封面图 |
| `/story-review`、`/审查` | story-review | 多视角对抗式审查 |
| `/story-import`、`/导入` | story-import | 逆向导入已有小说到项目结构 |
| `/story`、`/网文` | story | 工具箱路由 · 模糊意图自动分发 |
| `/story-setup`、`/准备写书` | story-setup | 环境部署 · hooks/rules/agents 一键部署 |
| `/browser`、`/browser-cdp` | browser | 浏览器自动化（CDP） |

## 通用 Skills

| 命令 | Skill | 说明 |
|------|-------|------|
| `/word`、`/docx` | word-power-tools | Word 文档处理（转换/提取/替换/合并/排版） |
| `/去AI味`、`/humanize` | humanize:text | 去AI味 · 让文字自然有人味 |
| `/美化代码` | humanize:code | 代码去AI味 |
| `/配置` | update-config | 修改 settings.json 配置（权限/钩子/环境变量） |
| `/快捷键` | keybindings-help | 自定义键盘快捷键 |
| `/简化` | simplify | 审查代码质量/效率并优化 |
| `/免打扰` | fewer-permission-prompts | 减少权限弹窗 · 添加命令白名单 |
| `/定时`、`/loop` | loop | 定时重复执行任务 |
| `/Codex-api` | Codex-api | 构建/调试/优化 Codex API / Anthropic SDK 应用 |
| `/初始化` | init | 初始化 AGENTS.md |
| `/review` | review | Review Pull Request |
| `/安全审查` | security-review | 安全审查当前分支变更 |

## 文件结构

- `拆文库/` — 拆文分析结果存放目录
- `novel/研究/` — 写作技法研究、素材库（打斗库、幽默素材库、对话写作研究等）
- `novel/正文/` — 长篇小说正文章节
- `novel/设定/` — 角色设定、世界设定
- `novel/大纲/` — 卷纲、细纲
- `novel/追踪/` — 上下文.md（写作上下文）、伏笔.md
- `novel/对标/` — 对标作品分析

## 协作规则

Agent 间的协调关系由各 Agent 定义文件的职责边界描述，不需要独立协调规则文件。

## Compact 后恢复上下文

此部分在 compact 后自动生效。AGENTS.md 在每次 compact 后会被重新加载。
写作中的关键上下文：
1. 当前写作项目名称和进度
2. 最近讨论的角色设定变更
3. 未完成的伏笔列表
4. 当前章节的情绪/节奏目标

如果存在 novel/追踪/上下文.md，compact 后首先读取恢复上下文。
