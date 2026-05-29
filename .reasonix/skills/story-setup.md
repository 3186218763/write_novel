---
name: story-setup
description: 网文写作工具集基础设施部署。将 hooks/rules/agents/CLAUDE.md 等基础设施部署到用户项目目录。
---
# story-setup：网文写作工具集基础设施部署

你是写作基础设施部署器。将网文写作工具集的全套基础设施部署到用户项目目录。

**执行铁律：不覆盖用户已有配置，合并而非替换。**

## Phase 1：检测项目状态

1. 检查当前目录是否已部署过（存在 `.story-deployed`）→ 如存在则确认是否重新部署
2. 检查是否有书名目录（包含 `novel/追踪/` 或 `追踪/` 子目录的目录）→ 识别为长篇项目
3. 检查 `.claude/settings.local.json` 是否存在
4. 检查 `.active-book` 文件是否存在

## Phase 2：部署基础设施

### 2.1 部署 CLAUDE.md

- 读取 `.agents/skills/story-setup/references/templates/CLAUDE.md.tmpl`（如存在）
- 替换占位符：`{项目名}`、`{书名}`、`{目标平台}`、`{作者名}`
- 写入项目根目录 `CLAUDE.md`（如已存在，按 marker/section 合并策略处理）

### 2.2 部署 Hooks

- 将 `.agents/skills/story-setup/references/templates/hooks/` 复制到 `.claude/hooks/`
- 对 `.claude/hooks/*.sh` 设置执行权限

### 2.3 部署 Rules

- 将 `.agents/skills/story-setup/references/templates/rules/` 下所有 `.md` 复制到 `.claude/rules/`

### 2.4 部署 Agents

- 将 `.agents/skills/story-setup/references/templates/agents/` 下所有 `.md` 复制到 `.claude/agents/`

### 2.5 部署 Agent References

- 将 agent-references 复制到 `.claude/skills/story-setup/references/agent-references/`

### 2.6 合并 Hooks 注册到 settings.local.json

- 按 command 字段去重合并

### 2.7 创建部署标记 `.story-deployed`

```
deployed_at: <timestamp>
agents_version: 9
setup_skill_version: 1.1.0
```

## Phase 3：验证安装

1. 验证 hooks 注册和脚本权限
2. 验证 rules 含 `paths` frontmatter
3. 验证 7 个 agent 文件存在
4. 验证部署标记
5. 输出安装报告

## CLAUDE.md 合并策略

用户已有 CLAUDE.md 时：
1. 识别 story-setup 管理块标记
2. 无标记时按 `##` 标题切分，模板标准 section 覆盖同名，用户独有 section 保留
3. 冲突用确认制

## 语言

- 跟随用户语言回复
- 中文遵循《中文文案排版指北》
