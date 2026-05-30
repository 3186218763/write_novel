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
| `/claude-api` | claude-api | 构建/调试/优化 Claude API / Anthropic SDK 应用 |
| `/初始化` | init | 初始化 CLAUDE.md |
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

此部分在 compact 后自动生效。CLAUDE.md 在每次 compact 后会被重新加载。
写作中的关键上下文：
1. 当前写作项目名称和进度
2. 最近讨论的角色设定变更
3. 未完成的伏笔列表
4. 当前章节的情绪/节奏目标

如果存在 novel/追踪/上下文.md，compact 后首先读取恢复上下文。

<!-- SPECKIT START -->
## Spec Kit — Spec-Driven Development

Spec Kit 是一套规格驱动开发（SDD）工具。

| 命令 | Skill | 说明 |
|------|-------|------|
| `/speckit-specify` | speckit-specify | 基于自然语言描述创建功能规格文档 |
| `/speckit-plan` | speckit-plan | 基于规格生成技术实现计划 |
| `/speckit-tasks` | speckit-tasks | 将计划分解为可执行的任务列表 |
| `/speckit-implement` | speckit-implement | 逐任务执行实现 |
| `/speckit-analyze` | speckit-analyze | 跨文档一致性与质量分析（只读） |
| `/speckit-clarify` | speckit-clarify | 识别规格中的歧义并澄清 |
| `/speckit-constitution` | speckit-constitution | 创建/更新项目宪法（核心原则） |
| `/speckit-checklist` | speckit-checklist | 生成领域自定义检查清单 |
| `/speckit-taskstoissues` | speckit-taskstoissues | 将任务转为 GitHub Issues |

### 工作流

```
/speckit-constitution  →  定义项目核心开发原则
         ↓
/speckit-specify       →  用自然语言描述功能 → 生成 spec.md
         ↓
/speckit-clarify       →  澄清规格中的歧义（可选，建议）
         ↓
/speckit-plan          →  生成 plan.md + research.md + data-model.md + contracts/
         ↓
/speckit-tasks         →  生成 tasks.md（可执行的任务列表）
         ↓
/speckit-analyze       →  跨文档一致性与覆盖分析（可选的审查步骤）
         ↓
/speckit-implement     →  按阶段执行任务
```

### 目录结构

- `specs/` — 功能规格文档目录（每个功能一个子目录）
- `.specify/templates/` — 规格、计划、任务、宪法的模板文件
- `.specify/memory/` — 项目宪法等持久记忆
- `.specify/init-options.json` — 项目初始化配置

### 当前活跃计划

- **001-fight-scene-optimization**: 战斗场景全章优化
  - 计划文件: `specs/001-fight-scene-optimization/plan.md`
  - 状态: Plan 阶段完成，等待 `/speckit-tasks` 生成任务列表
<!-- SPECKIT END -->
