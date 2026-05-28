# novel-writer 统一网文写作 Skill 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将 write_novel（13 Skills + 8 Hooks + 7 Agents）和 novel_any（6 Agents + 7 模块 Python 工具箱）整合为单一 Hermes 原生 skill：`~/.hermes/skills/novel-writer/`

**架构：** SKILL.md 作为统一入口路由，17 个 reference 子模块按 writing/analysis/polish/tools 分类存放，9 个 Agent 定义独立于 agents/ 目录，Python 工具箱保持在 novel_tools/ 包结构中不动，项目模板增强合并。

**技术栈：** Hermes Skill 系统（SKILL.md + references/）/ Python (novel_tools) / Shell (scripts) / Markdown (Agent 定义)

**设计规格：** `docs/superpowers/specs/2026-05-28-novel-writer-design.md`

**源材料：**
- `/home/miku/.hermes/skills/novel_any/` — novel_any skill（6 Agent + Phase 文件 + 模板 + novel_tools）
- `/home/miku/Research/write_novel/.claude/skills/` — write_novel 13 Skills
- `/home/miku/Research/write_novel/.claude/agents/` — write_novel 7 Agent 定义
- `/home/miku/Research/write_novel/.claude/hooks/` — write_novel 9 Hook 脚本
- `/home/miku/Research/write_novel/novel/` — 现有小说项目文件（需迁移路径）

---

## 文件结构

```
~/.hermes/skills/novel-writer/
├── SKILL.md                    ← 新建：统一入口 + 触发匹配 + 路由分发
├── README.md                   ← 新建：用户快速入门
├── pyproject.toml              ← 新建：Python 包配置
├── references/                 ← 从 write_novel skills + novel_any 迁移
│   ├── phases/                 ← 从 novel_any references/ 复制 phase 文件
│   ├── writing/                ← 从 write_novel .claude/skills/ 复制 4 个 writing skill
│   ├── analysis/               ← 从 write_novel .claude/skills/ 复制 4 个 analyze/scan skill
│   ├── polish/                 ← 从 write_novel .claude/skills/ 复制 review/deslop + 新建 style-lint-workflow
│   ├── tools/                  ← 从 write_novel .claude/skills/ 复制 import/cover/setup/browser
│   ├── hooks/                  ← 新建 hooks.md（汇总 Hook 迁移逻辑）
│   ├── genre/                  ← 从 novel_any references/ 复制 genre-web/genre-trad
│   └── research/               ← 从 novel_any references/ 复制 12+ 个调研文件
├── agents/                     ← 新建 9 个 Agent 定义
│   ├── story-architect.md      ← 合并 novel_any architect + write_novel story-architect
│   ├── character-designer.md   ← 合并去重
│   ├── narrative-writer.md     ← 合并 novel_any narrator + write_novel narrative-writer
│   ├── consistency-checker.md  ← 合并去重（裁剪逻辑检查维度给 logic-checker）
│   ├── polisher.md             ← 从 novel_any 复制
│   ├── scene-specialist.md     ← 从 novel_any 复制
│   ├── story-researcher.md     ← 从 write_novel .codex/agents/ 迁移
│   ├── story-explorer.md       ← 从 write_novel .codex/agents/ 迁移
│   └── logic-checker.md        ← 从 write_novel .codex/agents/ 迁移
├── novel_tools/                ← 从 novel_any novel_tools/ 整体复制（保持包结构不动）
├── templates/                  ← 从 novel_any templates/ 复制 + write_novel 增强
└── scripts/                    ← 新建 install-deps.sh + playwright-setup.sh
```

---

### 任务 1：创建目录脚手架

**文件：**
- 创建：`~/.hermes/skills/novel-writer/` 全部子目录

- [ ] **步骤 1：创建基础目录结构**

```bash
mkdir -p ~/.hermes/skills/novel-writer/
mkdir -p ~/.hermes/skills/novel-writer/references/{phases,writing,analysis,polish,tools,hooks,genre,research}
mkdir -p ~/.hermes/skills/novel-writer/agents
mkdir -p ~/.hermes/skills/novel-writer/novel_tools
mkdir -p ~/.hermes/skills/novel-writer/templates/{project-web,project-trad}
mkdir -p ~/.hermes/skills/novel-writer/scripts
```

- [ ] **步骤 2：验证目录结构**

```bash
find ~/.hermes/skills/novel-writer/ -type d | sort
```

预期输出：19 个目录（根 + 18 个子目录）

- [ ] **步骤 3：Commit**

```bash
cd ~/.hermes/skills/novel-writer && git init && git add -A && git commit -m "feat: novel-writer directory scaffolding"
cd /home/miku/Research/write_novel && git add -A && git commit -m "feat: novel-writer skill scaffolding"
```

---

### 任务 2：编写 SKILL.md 核心入口

**文件：**
- 创建：`~/.hermes/skills/novel-writer/SKILL.md`

- [ ] **步骤 1：编写 YAML frontmatter + 触发声明**

```markdown
---
name: novel-writer
version: 1.0.0
description: |
  统一网文写作系统。整合 13 个写作 Skills + 9 Agent + 7 模块 Python 工具箱。
  覆盖开书→大纲→写作→审查→去AI味→精修→拆文→扫榜→Pipeline 全流程。
  触发方式：/novel <subcommand> 或自然语言关键词（「写小说」「拆文」「审查」等）
---
```

- [ ] **步骤 2：编写斜杠命令路由表**

根据设计规格 §2.1，列出 18 个斜杠命令及其意图映射：

```markdown
## 斜杠命令

| 命令 | 意图 |
|------|------|
| `/novel write` | writing (long) |
| `/novel write-long` | writing (long) |
| `/novel write-short` | writing (short) |
| `/novel review` | review (full) |
| `/novel review-lean` | review (lean) |
| `/novel analyze` | analyze (long) |
| `/novel analyze-short` | analyze (short) |
| `/novel scan` | market-scan |
| `/novel deslop` | deslop |
| `/novel revise` | revise |
| `/novel outline` | outline |
| `/novel character` | character |
| `/novel scene` | scene |
| `/novel polish` | polish |
| `/novel import` | import |
| `/novel setup` | setup |
| `/novel cover` | cover |
| `/novel pipe` | pipeline |
```

- [ ] **步骤 3：编写自然语言关键词匹配表**

```markdown
## 自然语言关键词匹配

匹配优先级：斜杠命令 > 精确关键词 > 模糊关键词。

| 关键词 | 意图 |
|--------|------|
| 「写小说」「开新书」 | writing (long) |
| 「写短篇」「短篇」 | writing (short) |
| 「继续写」「续写」「继续」 | writing (continue，触发上下文恢复) |
| 「修改」「重写」「改一下」「回炉」 | revise |
| 「列大纲」「剧情构思」「设计剧情」 | outline |
| 「设计角色」「人设」「人物设定」 | character |
| 「世界观」「背景设定」 | character (worldbuilding) |
| 「拆文」「分析这本书」「深度拆解」 | analyze |
| 「扫榜」「最近什么火」「市场」 | market-scan |
| 「审查」「审稿」 | review |
| 「润色」「打磨」 | polish |
| 「去AI味」「太AI了」「deslop」 | deslop |
| 「分析场景」「打斗怎么写」「对话技法」 | scene |
```

- [ ] **步骤 4：编写粒度判断与委派逻辑**

```markdown
## 路由分发

用户输入 → 正规化 → 意图映射 → 粒度判断

**轻量任务（内联执行）：** 单章去AI味、格式检查、字数统计、对话润色、单章审查、语言润色

**动态任务（先内联后升级）：** 伏笔查询（先查伏笔.md → 无则委派）、节奏分析（单章内联 → 多章委派）
  升级阈值：涉及章节 > 3 章或总字数 > 10000 字

**重量任务（委派 delegate_task）：** 逐章写作、全文审查、全量拆文、扫榜、pipeline、大纲构思、角色设计、世界观设计、场景技法、批量去AI味、短篇写作/拆文、修改/重写
```

- [ ] **步骤 5：编写委派模板**

```markdown
## 委派模板

变量来源：
- {项目目录} = 当前工作目录
- {书名} = 从 {项目目录}/追踪/上下文.md 提取
- {N} = 用户输入或上下文中的"当前章节"+1
- {细纲路径} = {项目目录}/大纲/细纲_第{N}章.md

### 写作委派
delegate_task(
  goal="写作《{书名}》第{N}章「{章名}」",
  context="项目路径: {项目目录}\n细纲: {细纲路径}\n加载 references/phases/writing.md + agents/narrative-writer.md",
  toolsets=["terminal", "file"]
)

### 审查委派 (full: 4 Agent)
delegate_task(
  goal="对《{书名}》第{A}-{B}章执行全文审查",
  context="项目路径: {项目目录}\n加载 references/polish/story-review.md\n审查Agent: consistency-checker + logic-checker + story-architect + polisher",
  toolsets=["terminal", "file"]
)
```

- [ ] **步骤 6：编写 Phase 流程**

```markdown
## Phase 流程

Step 0: 选题定位 — story-researcher（用户已有方向→跳过）
Phase 1: 大纲构思 — story-architect → character-designer
Phase 2: 写作执行 — narrative-writer → consistency-checker(每章) → 每10章checkpoint
Phase 3: 精修审查 — consistency-checker + polisher
```

- [ ] **步骤 7：编写 Compact 恢复上下文**

```markdown
## Compact 后恢复上下文

compact 后按顺序加载：
1. context-brief.md — 全局快照
2. {项目目录}/追踪/上下文.md — 写作位置/进度
3. {项目目录}/追踪/伏笔.md — 待回收伏笔
4. {项目目录}/追踪/角色状态.md — 角色当前状态
5. {项目目录}/大纲/细纲_第{N}章.md — 写作目标
6. {项目目录}/正文/第{N}章_{章名}.md — 前一章正文
7. {项目目录}/审查/上次审查报告.md — 已知问题
```

- [ ] **步骤 8：编写环境依赖说明**

```markdown
## 环境依赖

Python 工具箱依赖（一次性安装）：
  uv pip install --python ~/.hermes/hermes-agent/venv/bin/python \
    jieba snownlp pypinyin networkx cloudscraper playwright beautifulsoup4 lxml
  playwright install chromium

启动门禁（每会话自动执行）：
1. 检测项目状态（是否存在追踪/上下文.md）
2. 时间检查（上次写作距今 > 7 天 → 提示回顾）
3. 伏笔预警（python -m novel_tools.cli bible foreshadow warn）
```

- [ ] **步骤 9：验证 SKILL.md 合法性**

```bash
# 检查 frontmatter 解析
python3 -c "
import yaml
with open('$HOME/.hermes/skills/novel-writer/SKILL.md') as f:
    content = f.read()
    if content.startswith('---'):
        end = content.index('---', 3)
        frontmatter = yaml.safe_load(content[3:end])
        assert frontmatter['name'] == 'novel-writer'
        print('SKILL.md frontmatter OK')
"
```

- [ ] **步骤 10：Commit**

```bash
cd ~/.hermes/skills/novel-writer && git add SKILL.md && git commit -m "feat: SKILL.md entry point with routing, phases, and compact recovery"
```

---

### 任务 3：迁移 Phase 流程文件

**文件：**
- 创建：`~/.hermes/skills/novel-writer/references/phases/outline.md`
- 创建：`~/.hermes/skills/novel-writer/references/phases/writing.md`
- 创建：`~/.hermes/skills/novel-writer/references/phases/polish.md`

- [ ] **步骤 1：从 novel_any 复制 Phase 文件**

```bash
SRC=~/.hermes/skills/novel_any/references
DST=~/.hermes/skills/novel-writer/references/phases

# novel_any 的 phase 文件可能在 SKILL.md 中内联定义，需要提取
# 检查是否有独立的 phase 文件
ls $SRC/phases/ 2>/dev/null || echo "Phase files not in subdirectory — need to extract from SKILL.md"
```

- [ ] **步骤 2：Agent 引用命名更新**

在三个 phase 文件中，将旧 Agent 名称替换为新名称：
- `architect` → `story-architect`
- `narrator` → `narrative-writer`

在 outline.md 开头添加：
```markdown
> 引用 agents/story-architect.md + agents/character-designer.md
```

在 writing.md 开头添加：
```markdown
> 引用 agents/narrative-writer.md + agents/consistency-checker.md
```

在 polish.md 开头添加：
```markdown
> 引用 agents/consistency-checker.md + agents/polisher.md
```

- [ ] **步骤 3：验证文件存在且内容非空**

```bash
for f in outline writing polish; do
  wc -l ~/.hermes/skills/novel-writer/references/phases/$f.md
done
```

预期：每个文件 > 50 行

- [ ] **步骤 4：Commit**

```bash
cd ~/.hermes/skills/novel-writer && git add references/phases/ && git commit -m "feat: migrate phase workflow files from novel_any"
```

---

### 任务 4：迁移写作子模块（writing/）

**文件：**
- 从 `/home/miku/Research/write_novel/.claude/skills/story-long-write/SKILL.md` 复制到 `references/writing/story-long-write.md`
- 从 `/home/miku/Research/write_novel/.claude/skills/story-short-write/SKILL.md` 复制到 `references/writing/story-short-write.md`
- 从 story-long-write 的 references/ 提取 `workflow-daily.md` → `references/writing/workflow-daily.md`
- 从 story-long-write 的 references/ 提取 `workflow-revision.md` → `references/writing/workflow-revision.md`

- [ ] **步骤 1：复制 4 个 writing 子模块**

```bash
SRC=/home/miku/Research/write_novel/.claude/skills
DST=~/.hermes/skills/novel-writer/references/writing

cp $SRC/story-long-write/SKILL.md $DST/story-long-write.md
cp $SRC/story-short-write/SKILL.md $DST/story-short-write.md

# 提取 workflow 文件
cp $SRC/story-long-write/references/workflow-daily.md $DST/workflow-daily.md
cp $SRC/story-long-write/references/workflow-revision.md $DST/workflow-revision.md
```

- [ ] **步骤 2：去除文件中的 YAML frontmatter**

这些文件在作为 reference 加载时不需要独立的 frontmatter。去除 `---` 包裹的 YAML 块。

```bash
for f in $DST/*.md; do
  if head -1 "$f" | grep -q '^---$'; then
    # 找到第二个 ---，删除之前的所有行
    second_delim=$(grep -n '^---$' "$f" | sed -n '2p' | cut -d: -f1)
    if [ -n "$second_delim" ]; then
      sed -i "1,${second_delim}d" "$f"
    fi
  fi
done
```

- [ ] **步骤 3：验证文件非空**

```bash
for f in $DST/*.md; do
  echo "$f: $(wc -l < "$f") lines"
done
```

预期：每个文件 > 50 行

- [ ] **步骤 4：Commit**

```bash
cd ~/.hermes/skills/novel-writer && git add references/writing/ && git commit -m "feat: migrate writing sub-modules from write_novel"
```

---

### 任务 5：迁移分析子模块（analysis/）

**文件：**
- 复制 4 个 analyze/scan skill → `references/analysis/`

- [ ] **步骤 1：复制 4 个 analysis 子模块**

```bash
SRC=/home/miku/Research/write_novel/.claude/skills
DST=~/.hermes/skills/novel-writer/references/analysis

cp $SRC/story-long-analyze/SKILL.md $DST/story-long-analyze.md
cp $SRC/story-short-analyze/SKILL.md $DST/story-short-analyze.md
cp $SRC/story-long-scan/SKILL.md $DST/story-long-scan.md
cp $SRC/story-short-scan/SKILL.md $DST/story-short-scan.md
```

- [ ] **步骤 2：去除 frontmatter**

```bash
for f in $DST/*.md; do
  if head -1 "$f" | grep -q '^---$'; then
    second_delim=$(grep -n '^---$' "$f" | sed -n '2p' | cut -d: -f1)
    [ -n "$second_delim" ] && sed -i "1,${second_delim}d" "$f"
  fi
done
```

- [ ] **步骤 3：Commit**

```bash
cd ~/.hermes/skills/novel-writer && git add references/analysis/ && git commit -m "feat: migrate analysis sub-modules from write_novel"
```

---

### 任务 6：迁移精修子模块（polish/）

**文件：**
- 创建：`references/polish/story-review.md`
- 创建：`references/polish/story-deslop.md`
- 创建：`references/polish/style-lint-workflow.md`

- [ ] **步骤 1：复制 story-review 和 story-deslop**

```bash
SRC=/home/miku/Research/write_novel/.claude/skills
DST=~/.hermes/skills/novel-writer/references/polish

cp $SRC/story-review/SKILL.md $DST/story-review.md
cp $SRC/story-deslop/SKILL.md $DST/story-deslop.md
```

- [ ] **步骤 2：去除 frontmatter**

```bash
for f in $DST/story-review.md $DST/story-deslop.md; do
  second_delim=$(grep -n '^---$' "$f" | sed -n '2p' | cut -d: -f1)
  [ -n "$second_delim" ] && sed -i "1,${second_delim}d" "$f"
done
```

- [ ] **步骤 3：创建 style-lint-workflow.md**

```bash
cat > $DST/style-lint-workflow.md << 'STYLEEOF'
# style-lint-workflow：中文写作规范检查

> 对应 Python 模块：novel_tools.style_lint
> 用于 story-review（审查阶段）和 story-deslop（去AI味前预检）

## 检查项

1. **冗余措辞**：检测"进行""加以""予以"等书面化冗余
2. **陈词滥调**：检测"惊才绝艳""风华绝代"等网文高频模板词
3. **模糊措辞**：检测"似乎""仿佛""如同"等 AI 味标记词
4. **副词滥用**：检测"缓缓""微微""轻轻""淡淡"密度过高
5. **对话标签重复**：检测连续对话中"说道""问道"重复使用

## 调用方式

```bash
# 单文件检查
python -m novel_tools.cli style_lint check {项目目录}/正文/第{N}章_{章名}.md

# 批量检查（审查时使用）
python -m novel_tools.cli style_lint batch {项目目录}/正文/
```

## 输出解读

- `total_issues > 5` 且文本 > 2000 字 → 需要去AI味处理
- `total_issues > 1` 且文本 < 2000 字 → 短文本阈值，建议复查
- `redundancy_count > 2` → 优先处理冗余措辞
STYLEEOF
```

- [ ] **步骤 4：Commit**

```bash
cd ~/.hermes/skills/novel-writer && git add references/polish/ && git commit -m "feat: migrate polish sub-modules + create style-lint-workflow"
```

---

### 任务 7：迁移工具子模块（tools/）

**文件：**
- 创建：`references/tools/story-import.md`
- 创建：`references/tools/story-cover.md`
- 创建：`references/tools/story-setup.md`
- 创建：`references/tools/browser-cdp.md`

- [ ] **步骤 1：从 write_novel 复制 4 个 tools skill**

```bash
SRC=/home/miku/Research/write_novel/.claude/skills
DST=~/.hermes/skills/novel-writer/references/tools

cp $SRC/story-import/SKILL.md $DST/story-import.md
cp $SRC/story-cover/SKILL.md $DST/story-cover.md
cp $SRC/story-setup/SKILL.md $DST/story-setup.md
cp $SRC/browser-cdp/SKILL.md $DST/browser-cdp.md
```

- [ ] **步骤 2：去除 frontmatter**

```bash
for f in $DST/*.md; do
  second_delim=$(grep -n '^---$' "$f" | sed -n '2p' | cut -d: -f1)
  [ -n "$second_delim" ] && sed -i "1,${second_delim}d" "$f"
done
```

- [ ] **步骤 3：Commit**

```bash
cd ~/.hermes/skills/novel-writer && git add references/tools/ && git commit -m "feat: migrate tools sub-modules from write_novel"
```

---

### 任务 8：迁移类型参考和调研文件（genre/ + research/）

**文件：**
- 从 novel_any references/ 复制 genre-web.md, genre-trad.md → `references/genre/`
- 从 novel_any references/ 复制全部调研文件 → `references/research/`

- [ ] **步骤 1：复制 genre 文件**

```bash
SRC=~/.hermes/skills/novel_any/references
DST=~/.hermes/skills/novel-writer/references

cp $SRC/genre-web.md $DST/genre/genre-web.md 2>/dev/null || echo "Skipping genre-web"
cp $SRC/genre-trad.md $DST/genre/genre-trad.md 2>/dev/null || echo "Skipping genre-trad"
```

- [ ] **步骤 2：复制全部 research 文件**

```bash
# novel_any 的 reference 文件分布在 references/ 根目录
# 复制所有 .md 文件到 research/
for f in $SRC/*.md; do
  cp "$f" "$DST/research/$(basename "$f")"
done

# 排除已单独处理的 phase 文件（如果有）
rm -f $DST/research/outline.md $DST/research/writing.md $DST/research/polish.md

# 列出复制结果
ls $DST/research/
```

- [ ] **步骤 3：创建 hooks.md**

```bash
cat > ~/.hermes/skills/novel-writer/references/hooks/hooks.md << 'HOOKSEOF'
# Hooks 执行逻辑

> 原 write_novel 的 9 个 Hooks → Hermes 8 个实现点

| 原 Hook | Hermes 实现 | 说明 |
|---------|------------|------|
| session-start | SKILL.md 启动门禁 | 自动检测项目状态/伏笔预警 |
| session-end | Phase 2 追踪更新中追加会话日志 | narrative-writer 写入追踪/会话日志.md |
| pre-compact / post-compact | SKILL.md compact 恢复段 | 恢复指导 |
| format-novel | `novel-tools format` CLI | 机械操作走 Python，不走 LLM |
| detect-story-gaps | consistency-checker 委派 | 审查阶段自动触发 |
| validate-story-commit | 可选 git hook 脚本 | 用户按需安装 |
| sentinel | .story-deployed 文件 | story-setup 生成 |
HOOKSEOF
```

- [ ] **步骤 4：Commit**

```bash
cd ~/.hermes/skills/novel-writer && git add references/genre/ references/research/ references/hooks/ && git commit -m "feat: migrate genre, research references + create hooks.md"
```

---

### 任务 9：创建 Agent 定义（story-architect）

**文件：**
- 创建：`~/.hermes/skills/novel-writer/agents/story-architect.md`

合并来源：novel_any architect + write_novel story-architect

- [ ] **步骤 1：编写 story-architect.md**

```bash
cat > ~/.hermes/skills/novel-writer/agents/story-architect.md << 'AGENTEOF'
---
name: story-architect
description: 题材定位→情绪定位→大纲展开；钩子/悬念/反转设计；情绪弧线；结构审查
tools: [Read, Write, Edit, Glob, Grep]
maxTurns: 25
---

# Story Architect — 故事架构师

你是故事架构师，负责将想法转化为完整的故事框架。

## 核心方法

### Step 1：题材与情绪定位（来源：write_novel）

不急于动笔——先确认能稳定交付什么情绪：
- 打脸/逆袭 → 爽感释放
- 身份反转 → 震撼+痛快
- 感情拉扯 → 意难平
- 日常装逼 → 期待感
- 悬疑/惊悚 → 紧张+好奇

从验证过的模式出发：每个题材都有验证过的剧情模式。做角色位抽象——把对标书的角色抽象为功能位（对手/盟友/催化剂），映射到用户的角色。

### Step 2：大纲展开（来源：novel_any）

确认情绪定位后，按以下层级展开：
1. **故事内核**：一句话梗概 + 核心冲突
2. **卷级结构**：全书分几卷，每卷的核心事件和情绪弧线
3. **章级细纲**：每章的核心事件、情绪目标、出场角色、待回收伏笔

### Step 3：结构审查

审查时聚焦：
- 节奏曲线是否有高峰低谷（不单调）
- 每章章尾是否有钩子（信息差/悬念/爽点预告）
- 反转是否有足够的铺垫（铺放比至少 3:1）

## 工具

- 调用 `skill_view(name="novel-writer", file_path="references/genre/genre-web.md")` 加载网文类型参考
- 使用 search_files 搜索现有大纲和设定文件
- 产出文件写入 {项目目录}/大纲/

## 约束

- 每次只做一个步骤，完成后停下来让用户确认
- 大纲是协商基础，不是圣旨——写作中发现需要调整时主动提出
AGENTEOF
```

- [ ] **步骤 2：Commit**

```bash
cd ~/.hermes/skills/novel-writer && git add agents/story-architect.md && git commit -m "feat: create story-architect agent (merged architect + story-architect)"
```

---

### 任务 10：创建 Agent 定义（character-designer）

**文件：**
- 创建：`~/.hermes/skills/novel-writer/agents/character-designer.md`

合并来源：novel_any character-designer + write_novel character-designer（去重）

- [ ] **步骤 1：编写 character-designer.md**

```bash
cat > ~/.hermes/skills/novel-writer/agents/character-designer.md << 'AGENTEOF'
---
name: character-designer
description: 角色档案/语言风格/动机链/人物弧线/关系网络/世界观设计
tools: [Read, Write, Edit, Glob, Grep]
maxTurns: 15
---

# Character Designer — 角色设计师

你是角色设计师，负责创造有血有肉的角色。

## 职责

1. **角色档案**：姓名、外貌、性格标签、语言风格、口头禅
2. **动机链**：表层欲望 → 深层需求 → 行为逻辑
3. **人物弧线**：起点状态 → 成长方向 → 关键转折点
4. **关系网络**：与其他角色的关系类型（盟友/对手/催化剂/恋人/家人）、关系动态
5. **世界观设计**（触发关键词：「世界观」「背景设定」时）：力量体系、地理势力、世界规则

## 工作流

### 大纲后自动触发
大纲确认后，扫描大纲中所有提及的角色，逐一建立角色档案。

### 写作中按需触发
用户说「设计一个新角色」「{角色名}的人设是什么」「给{角色}加一个秘密」时介入。

## 约束

- 角色设定写入 {项目目录}/设定/角色/{角色名}.md
- 世界观设定写入 {项目目录}/设定/世界观/
- 每次展示角色设定后停下来确认
- 角色动机链必须有内在逻辑，不能为了剧情需要而违反人设
AGENTEOF
```

- [ ] **步骤 2：Commit**

```bash
cd ~/.hermes/skills/novel-writer && git add agents/character-designer.md && git commit -m "feat: create character-designer agent (merged from novel_any + write_novel)"
```

---

### 任务 11：创建 Agent 定义（narrative-writer）

**文件：**
- 创建：`~/.hermes/skills/novel-writer/agents/narrative-writer.md`

合并来源：novel_any narrator + write_novel narrative-writer

- [ ] **步骤 1：编写 narrative-writer.md**

```bash
cat > ~/.hermes/skills/novel-writer/agents/narrative-writer.md << 'AGENTEOF'
---
name: narrative-writer
description: 逐章写作 + 内联去AI味 + 格式合规 + 字数额度管控
tools: [Read, Write, Edit, Glob, Grep]
maxTurns: 25
---

# Narrative Writer — 叙事写手

你是叙事写手，将细纲转化为正文。

## 铁律（来源：novel_any）

1. **先表态，再协商**。遇到决策点时，先给出你的判断和建议，再请作者回应。
2. **每次只做一件事**。完成一章后停下，让作者确认或调整。
3. **大纲是协商基础，不是圣旨**。写作中发现大纲需要调整时，主动提出。

## 工艺标准（来源：write_novel）

### 写作流程

1. **写前确认**：加载当前章节细纲 + 情绪目标 + 出场角色档案 + 待回收伏笔
2. **三维织入**：剧情推进 + 情感变化 + 信息释放，每章三者缺一不可
3. **写作执行**：按细纲情节点逐条执行，~3000-4000字/章
4. **内联去AI味**（写完后立即执行）：
   - 禁用词扫描（仿佛/宛如/如同/说道/问道/嘴角勾起/眼中闪过/缓缓/微微 等）
   - 「像」频率 ≤ 10处/章
   - 「感到/觉得」零命中
   - 对话标签：60%+ 无标签，用动作替代"说"
   - 章尾无升华收尾（用动作/对话收尾）
5. **格式合规**：一段一句、无超60字段落、对话独立成行、无段间空行
6. **追踪更新**：写完后更新 追踪/上下文.md、追踪/角色状态.md、追踪/时间线.md、追踪/伏笔.md

### 字数与节奏

- 大章（高潮/核心事件）：4000-5000字
- 小章（日常/过渡）：~3000字
- 每 10 章 checkpoint：触发 consistency-checker 深度审查

## 约束

- 正文写入 {项目目录}/正文/第{N}章_{章名}.md
- 写完后主动调用 `python -m novel_tools.cli slop scan {路径}` 做定量预检
- 写完后主动调用 `python -m novel_tools.cli style_lint check {路径}` 做规范检查
- 每次写完一章停下来，让用户确认
AGENTEOF
```

- [ ] **步骤 2：Commit**

```bash
cd ~/.hermes/skills/novel-writer && git add agents/narrative-writer.md && git commit -m "feat: create narrative-writer agent (merged narrator + narrative-writer)"
```

---

### 任务 12：创建 Agent 定义（consistency-checker + logic-checker）

**文件：**
- 创建：`~/.hermes/skills/novel-writer/agents/consistency-checker.md`
- 创建：`~/.hermes/skills/novel-writer/agents/logic-checker.md`

- [ ] **步骤 1：编写 consistency-checker.md（跨章事实一致性）**

```bash
cat > ~/.hermes/skills/novel-writer/agents/consistency-checker.md << 'AGENTEOF'
---
name: consistency-checker
description: 跨章事实一致性与伏笔状态检查（只读）。grep-first 方式检测设定矛盾、时间线冲突、伏笔断线、角色属性不一致。
tools: [Read, Glob, Grep]
maxTurns: 15
---

# Consistency Checker — 一致性检查员

你是只读的事实一致性检查员。不做创作判断。

## 检查流程

### 第一步：发现项目关键术语
扫描 {项目目录}/设定/角色/、设定/世界观/、追踪/伏笔.md，构建检查词表。

### 第二步：基于术语执行冲突扫描

#### 实体冲突
- 角色属性跨章不一致（外貌/身份/能力/家庭关系）
- 同一时间角色出现在两个地方
- 角色对不应知道的事件做出反应

#### 设定冲突
- 力量体系描述前后矛盾
- 世界规则被违反

#### 伏笔检测
- 已埋伏笔是否超期未回收（>10章未提及）
- 回收伏笔时回收方式与埋伏方式一致

#### 时间线
- 跨章时间线是否连贯
- 时间跨度与实际描述是否匹配

## S1-S4 分级

| 等级 | 定义 | 示例 |
|------|------|------|
| S1 | 硬伤：必须修复 | "第三章说她是黑发，第十章说她是金发" |
| S2 | 隐性矛盾：高概率是错误 | "第一章说魔法需要吟唱，第五章瞬发" |
| S3 | 细节不一致：不影响主线 | "咖啡杯从白色变成蓝色" |
| S4 | 建议：风格/习惯讨论 | "连续三章开头都是'清晨醒来'" |

## 注意：不在本 Agent 职责范围
- **章内逻辑细节** → 由 logic-checker 检查
- **文风/语言质量** → 由 polisher 检查
- **结构/节奏** → 由 story-architect 检查
AGENTEOF
```

- [ ] **步骤 2：编写 logic-checker.md（章内逻辑细节）**

```bash
cat > ~/.hermes/skills/novel-writer/agents/logic-checker.md << 'AGENTEOF'
---
name: logic-checker
description: 章内逻辑细节检测（只读）。P0-P6 检查时间线/场景身份/动作连贯/知识边界/能力/对话独白/视角。
tools: [Read, Glob, Grep]
maxTurns: 15
---

# Logic Checker — 逻辑检查员

你是章内逻辑检查员。只检查单章内 + 直接关联上下文。不做跨章设定级检查。

## P0-P6 检查维度

| 等级 | 维度 | 示例 |
|------|------|------|
| P0 | 时间线 | "太阳刚下山" → 下一页是"午后的阳光" |
| P1 | 场景身份 | 在教室说话 → 下一句突然在操场 |
| P2 | 动作连贯 | 放下杯子 → 端起杯子（没有再次端起的动作） |
| P3 | 知识边界 | 角色说出他不知道的信息 |
| P4 | 能力边界 | 角色使用未铺垫过的能力 |
| P5 | 对话独白 | 对话/独白中角色说出不符合性格的话 |
| P6 | 视角一致 | 第一人称叙事中突然出现上帝视角 |

## 不被本 Agent 检查的
- 跨章角色属性不一致 → consistency-checker
- 跨章世界规则违反 → consistency-checker
- 文风/禁用词 → polisher
AGENTEOF
```

- [ ] **步骤 3：Commit**

```bash
cd ~/.hermes/skills/novel-writer && git add agents/consistency-checker.md agents/logic-checker.md && git commit -m "feat: create consistency-checker + logic-checker agents"
```

---

### 任务 13：创建 Agent 定义（polisher + scene-specialist）

**文件：**
- 创建：`~/.hermes/skills/novel-writer/agents/polisher.md`
- 创建：`~/.hermes/skills/novel-writer/agents/scene-specialist.md`

- [ ] **步骤 1：编写 polisher.md**

```bash
cat > ~/.hermes/skills/novel-writer/agents/polisher.md << 'AGENTEOF'
---
name: polisher
description: 精修阶段批量去AI味 + 跨章风格统一 + 禁用词全量扫描 + 文风润色
tools: [Read, Write, Edit, Glob, Grep]
maxTurns: 15
---

# Polisher — 精修师

你是精修师，负责将粗糙的正文打磨到出版质量。

## 职责

1. **批量去AI味**（区别于 narrative-writer 的写作时内联去AI味）
   - 跨章风格统一检查
   - 全文禁用词批量扫描
   - 全局节奏一致性检查
   - 对话风格跨章一致性

2. **优先级**：先运行 novel-tools 定量扫描，再定性润色
   ```bash
   python -m novel_tools.cli slop scan {文件路径}
   python -m novel_tools.cli style_lint check {文件路径}
   ```

## 与 narrative-writer 的分工

- **narrative-writer**：写作时逐章内联去AI味（写完立即执行）
- **polisher**：精修阶段跨章批量处理（风格统一、全量扫描）

## 去AI味原则

1. 改最少，效果最大——能改一个词就不改一句
2. 保留创作意图——只改"怎么说"，不改"说什么"
3. 删除比例分级：轻度≤15%、中度≤25%、重度≤35%
AGENTEOF
```

- [ ] **步骤 2：编写 scene-specialist.md**

```bash
cat > ~/.hermes/skills/novel-writer/agents/scene-specialist.md << 'AGENTEOF'
---
name: scene-specialist
description: 特定场景技法分析（打斗/对话/群像/情感/智斗）+ 输出技法建议文件
tools: [Read, Write, Glob, Grep]
maxTurns: 10
---

# Scene Specialist — 场景专精师

你是场景技法专家。只做分析和建议，不做全文审查。

## 触发条件

用户主动请求时加载（`/novel scene` 或关键词「分析场景」「打斗怎么写」「对话技法」）。

## 专精方向

| 场景类型 | 分析维度 |
|---------|---------|
| 打斗 | 节奏拆解、动作可视化、力量体系展示、受伤后果 |
| 对话 | 潜台词密度、角色区分度、信息释放比例、节奏控制 |
| 群像 | 焦点切换频率、角色存在感平衡、对话轮转 |
| 情感 | 情绪层次、身体语言、环境呼应、克制的力量 |
| 智斗 | 逻辑密度、信息差管理、反转铺垫、读者预期管理 |

## 输出

分析后输出技法建议文件到 {项目目录}/审查/场景分析_{类型}_{日期}.md。

不直接修改正文——由 narrative-writer 按建议执笔融入。
AGENTEOF
```

- [ ] **步骤 3：Commit**

```bash
cd ~/.hermes/skills/novel-writer && git add agents/polisher.md agents/scene-specialist.md && git commit -m "feat: create polisher + scene-specialist agents"
```

---

### 任务 14：创建 Agent 定义（story-researcher + story-explorer）

**文件：**
- 创建：`~/.hermes/skills/novel-writer/agents/story-researcher.md`
- 创建：`~/.hermes/skills/novel-writer/agents/story-explorer.md`

- [ ] **步骤 1：从 write_novel .codex/agents/ 迁移 story-researcher**

```bash
SRC=/home/miku/Research/write_novel/.codex/agents/story-researcher.toml
DST=~/.hermes/skills/novel-writer/agents/story-researcher.md

# 将 TOML 格式转为 markdown Agent 定义
cat > $DST << 'AGENTEOF'
---
name: story-researcher
description: 市场调研/扫榜/对标分析；CDP优先，WebSearch兜底
tools: [Read, Bash, Write, Glob, Grep, WebSearch]
disallowedTools: [Edit]
maxTurns: 20
---

# Story Researcher — 市场调研员

你是市场调研员，负责外部资料搜索和市场分析。

## 职责

1. **市场调研**：扫榜、分析当前热门题材和趋势
2. **对标分析**：找对标作品、分析其成功要素
3. **资料搜索**：写作需要的背景知识、专业信息检索

## 搜索策略

1. CDP（browser-cdp）优先：结构化网页内容抓取
2. WebSearch 兜底：CDP 不可用时使用搜索 API
3. WebFetch + 手动解析：最后手段

## 输出

研究结果写入 {项目目录}/参考资料/{topic}.md
AGENTEOF
```

- [ ] **步骤 2：从 write_novel .codex/agents/ 迁移 story-explorer**

```bash
cat > ~/.hermes/skills/novel-writer/agents/story-explorer.md << 'AGENTEOF'
---
name: story-explorer
description: 项目文件结构化查询（角色状态/伏笔进度/设定位置/时间线/写作进度）— 只读纯查询
tools: [Read, Glob, Grep]
maxTurns: 15
---

# Story Explorer — 项目浏览器

你是项目文件查询器。只做查询，不做创作，不做检查，不做修改。

## 职责

1. 从项目文件系统中检索信息并返回结构化结果
2. 辅助 Agent 在写作前快速加载上下文

## 查询类型

| 用户问 | 查询目标 |
|--------|---------|
| "{角色}现在是什么状态？" | 读取 追踪/角色状态.md + 设定/角色/{角色}.md |
| "有哪些待回收的伏笔？" | 读取 追踪/伏笔.md |
| "这本书写到哪了？" | 读取 追踪/上下文.md |
| "XX设定在哪里？" | 搜索 设定/ 目录 |

## 约束

- 只读——不写任何文件
- 不做一致性判断（那是 consistency-checker 的活）
- 不评价内容质量
AGENTEOF
```

- [ ] **步骤 3：Commit**

```bash
cd ~/.hermes/skills/novel-writer && git add agents/story-researcher.md agents/story-explorer.md && git commit -m "feat: create story-researcher + story-explorer agents from write_novel"
```

---

### 任务 15：迁移 Python 工具箱

**文件：**
- 从 `~/.hermes/skills/novel_any/novel_tools/` 整体复制到 `~/.hermes/skills/novel-writer/novel_tools/`

- [ ] **步骤 1：整体复制 novel_tools 包**

```bash
SRC=~/.hermes/skills/novel_any/novel_tools
DST=~/.hermes/skills/novel-writer/novel_tools

cp -r $SRC/* $DST/

# 验证文件数量
echo "novel_any novel_tools files: $(find $SRC -type f | wc -l)"
echo "novel-writer novel_tools files: $(find $DST -type f | wc -l)"
```

预期：两个数字相等。

- [ ] **步骤 2：验证导入可用**

```bash
cd ~/.hermes/skills/novel-writer
~/.hermes/hermes-agent/venv/bin/python -c "
import sys
sys.path.insert(0, '.')
from novel_tools.cli import main
print('novel_tools import OK')
"
```

- [ ] **步骤 3：Commit**

```bash
cd ~/.hermes/skills/novel-writer && git add novel_tools/ && git commit -m "feat: migrate novel_tools Python package"
```

---

### 任务 16：迁移模板并增强

**文件：**
- 从 novel_any templates/ 复制到 `~/.hermes/skills/novel-writer/templates/`
- 新增 `对标/` 和 `参考资料/` 目录（write_novel 增强）

- [ ] **步骤 1：复制现有模板**

```bash
SRC=~/.hermes/skills/novel_any/templates
DST=~/.hermes/skills/novel-writer/templates

cp -r $SRC/project-web/* $DST/project-web/
cp -r $SRC/project-trad/* $DST/project-trad/
```

- [ ] **步骤 2：添加 write_novel 增强目录**

```bash
mkdir -p $DST/project-web/对标 $DST/project-web/参考资料
mkdir -p $DST/project-trad/对标 $DST/project-trad/参考资料

# 在对标/下放 README 说明
cat > $DST/project-web/对标/README.md << 'EOF'
# 对标作品分析

存放对标小说的拆文报告和分析记录。
由 story-researcher 和 story-architect 在开书阶段填充。
EOF

cat > $DST/project-web/参考资料/README.md << 'EOF'
# 参考资料

存放写作过程中收集的背景资料和调研结果。
由 story-researcher 在调研阶段填充。
EOF

# 复制到 project-trad
cp $DST/project-web/对标/README.md $DST/project-trad/对标/README.md
cp $DST/project-web/参考资料/README.md $DST/project-trad/参考资料/README.md
```

- [ ] **步骤 3：Commit**

```bash
cd ~/.hermes/skills/novel-writer && git add templates/ && git commit -m "feat: migrate templates + add 对标 and 参考资料 directories"
```

---

### 任务 17：创建辅助脚本

**文件：**
- 创建：`~/.hermes/skills/novel-writer/scripts/install-deps.sh`
- 创建：`~/.hermes/skills/novel-writer/scripts/playwright-setup.sh`
- 创建：`~/.hermes/skills/novel-writer/README.md`
- 创建：`~/.hermes/skills/novel-writer/pyproject.toml`

- [ ] **步骤 1：创建 install-deps.sh**

```bash
cat > ~/.hermes/skills/novel-writer/scripts/install-deps.sh << 'SCRIPTEOF'
#!/bin/bash
# novel-writer Python 工具箱依赖安装脚本
# 用法: bash scripts/install-deps.sh

set -e

PYTHON_BIN="${HERMES_VENV_PYTHON:-~/.hermes/hermes-agent/venv/bin/python}"

echo "=== 安装 novel_tools Python 依赖 ==="
uv pip install --python "$PYTHON_BIN" \
  jieba snownlp pypinyin networkx cloudscraper playwright beautifulsoup4 lxml

echo "=== 安装 Playwright Chromium ==="
playwright install chromium

echo "=== 验证安装 ==="
"$PYTHON_BIN" -c "from novel_tools.cli import main; print('novel_tools 安装成功')"

echo "=== 安装完成 ==="
SCRIPTEOF
chmod +x ~/.hermes/skills/novel-writer/scripts/install-deps.sh
```

- [ ] **步骤 2：创建 playwright-setup.sh**

```bash
cat > ~/.hermes/skills/novel-writer/scripts/playwright-setup.sh << 'SCRIPTEOF'
#!/bin/bash
# WSL Playwright Chromium 环境设置
# 用法: source scripts/playwright-setup.sh

# WSL 下 Playwright 需要手动注入共享库路径
if [ -d ~/.cache/ms-playwright ]; then
  CHROMIUM_DIR=$(find ~/.cache/ms-playwright -maxdepth 2 -name "chrome-linux" -type d 2>/dev/null | head -1)
  if [ -n "$CHROMIUM_DIR" ]; then
    export LD_LIBRARY_PATH="$CHROMIUM_DIR:$LD_LIBRARY_PATH"
    echo "Playwright Chromium 路径已设置: $CHROMIUM_DIR"
  fi
fi
SCRIPTEOF
chmod +x ~/.hermes/skills/novel-writer/scripts/playwright-setup.sh
```

- [ ] **步骤 3：创建 README.md**

```bash
cat > ~/.hermes/skills/novel-writer/README.md << 'READMEEOF'
# novel-writer：统一网文写作 Skill

整合 write_novel（13 Skills + 7 Agents）+ novel_any（6 Agents + 7 模块 Python 工具箱）

## 快速开始

```bash
# 安装 Python 依赖
bash scripts/install-deps.sh

# 在 Hermes 会话中使用
/novel write        # 开始长篇写作
/novel review       # 多 Agent 审查
/novel deslop       # 去 AI 味
/novel pipe         # 跑 pipeline
```

## 完整命令

| 命令 | 功能 |
|------|------|
| `/novel write` | 长篇写作 |
| `/novel write-short` | 短篇写作 |
| `/novel review` / `review-lean` | 多 Agent 审查 |
| `/novel analyze` / `analyze-short` | 拆文分析 |
| `/novel scan` | 市场扫描 |
| `/novel deslop` | 去 AI 味 |
| `/novel revise` | 修改/重写 |
| `/novel outline` | 大纲构思 |
| `/novel character` | 角色设计 |
| `/novel scene` | 场景技法 |
| `/novel polish` | 语言润色 |
| `/novel import` | 导入已有小说 |
| `/novel setup` | 部署写作环境 |
| `/novel cover` | 生成封面 |
| `/novel pipe` | 跑 pipeline |

## 文档

- [设计规格](../../docs/superpowers/specs/2026-05-28-novel-writer-design.md)
READMEEOF
```

- [ ] **步骤 4：创建 pyproject.toml**

```bash
cat > ~/.hermes/skills/novel-writer/pyproject.toml << 'TOMLEOF'
[build-system]
requires = ["setuptools>=64.0"]
build-backend = "setuptools.backends._legacy:_Backend"

[project]
name = "novel-tools"
version = "0.3.0"
description = "网文写作定量分析工具箱"
requires-python = ">=3.10"
dependencies = [
    "jieba",
    "snownlp",
    "pypinyin",
    "networkx",
    "cloudscraper",
    "playwright",
    "beautifulsoup4",
    "lxml",
]

[tool.setuptools.packages.find]
where = ["."]
include = ["novel_tools*"]
TOMLEOF
```

- [ ] **步骤 5：Commit**

```bash
cd ~/.hermes/skills/novel-writer && git add scripts/ README.md pyproject.toml && git commit -m "feat: add helper scripts, README, and pyproject.toml"
```

---

### 任务 18：最终验证与收尾

**文件：** 无新建，验证现有结构

- [ ] **步骤 1：验证完整目录结构**

```bash
echo "=== 目录结构 ==="
find ~/.hermes/skills/novel-writer -not -path '*/.git/*' -not -path '*/.git' -not -path '*/novel_tools/*' | sort

echo ""
echo "=== 文件统计 ==="
echo "SKILL.md: $(wc -l < ~/.hermes/skills/novel-writer/SKILL.md) lines"
echo "Reference 文件: $(find ~/.hermes/skills/novel-writer/references -name '*.md' | wc -l)"
echo "Agent 文件: $(find ~/.hermes/skills/novel-writer/agents -name '*.md' | wc -l)"
echo "Python 文件: $(find ~/.hermes/skills/novel-writer/novel_tools -name '*.py' | wc -l)"
echo "模板文件: $(find ~/.hermes/skills/novel-writer/templates -type f | wc -l)"
```

预期：SKILL.md > 100 行，Reference ≥ 20 个，Agent = 9 个，Python > 30 个，模板 ≥ 30 个。

- [ ] **步骤 2：在 Hermes 中加载 skill**

```bash
# Hermes 重新加载 skills（如果支持）
echo "请在 Hermes 中执行 /reload-skills，然后尝试 /novel"
```

- [ ] **步骤 3：验证关键功能**

在 Hermes 中逐项测试（手动）：
1. `/novel write` → 应识别为 writing 意图
2. 「审查一下」 → 应识别为 review 意图
3. 「去AI味」 → 应识别为 deslop 意图
4. 在工作目录运行 `python -m novel_tools.cli` → 应输出帮助信息

- [ ] **步骤 4：迁移现有项目文件路径**

```bash
# 将 write_novel 项目的 novel/ 子目录内容迁移到扁平结构
cd /home/miku/Research/write_novel
if [ -d novel/正文 ]; then
  mkdir -p 正文 大纲 追踪 审查 设定/角色 设定/世界观
  cp -r novel/正文/* 正文/ 2>/dev/null
  cp -r novel/大纲/* 大纲/ 2>/dev/null
  cp -r novel/追踪/* 追踪/ 2>/dev/null
  cp -r novel/设定/角色/* 设定/角色/ 2>/dev/null
  cp -r novel/设定/世界观/* 设定/世界观/ 2>/dev/null
  echo "项目文件已迁移到扁平结构。原 novel/ 目录保留不动作为备份。"
fi
```

- [ ] **步骤 5：Commit 最终状态**

```bash
cd ~/.hermes/skills/novel-writer && git add -A && git commit -m "chore: final verification and project file migration"
cd /home/miku/Research/write_novel && git add -A && git commit -m "chore: project files migrated to flat structure for novel-writer compatibility"
```

---

## 任务依赖图

```
任务 1 (脚手架)
  ↓
任务 2 (SKILL.md) ───────────────────────────┐
  ↓                                           │
任务 3 (Phase 文件)                           │
  ↓                                           │
任务 4 (writing/) ──┐                         │
任务 5 (analysis/)  ├─ 可并行                 │
任务 6 (polish/)   ─┤                         │
任务 7 (tools/)    ─┤                         │
任务 8 (genre/research/hooks) ─┘              │
  ↓                                           │
任务 9  (story-architect) ──┐                 │
任务 10 (character-designer) │                 │
任务 11 (narrative-writer)  ├─ 可并行         │
任务 12 (consistency+logic) ─┤                │
任务 13 (polisher+scene)    ─┤                │
任务 14 (researcher+explorer)┘                │
  ↓                                           │
任务 15 (novel_tools) ────────────────────────┘
  ↓
任务 16 (templates)
  ↓
任务 17 (scripts/README/pyproject)
  ↓
任务 18 (验证与收尾)
```

---

## 自检

**规格覆盖度：**
- §1 目录结构 → 任务 1 创建所有目录 ✓
- §2 入口路由 → 任务 2 SKILL.md 包含全部路由逻辑 ✓
- §3 Agent 体系 → 任务 9-14 创建 9 个 Agent ✓
- §4 Python 工具箱 → 任务 15 整体迁移 ✓
- §5 Phase/Hooks/模板/恢复 → 任务 3 (Phase) + 任务 8 (hooks) + 任务 16 (模板) + 任务 2 (Compact 恢复) ✓
- §6 用户链路 → 任务 18 验证模拟 ✓

**占位符扫描：** 无 TODO/待定。所有文件路径和代码块已填充。

**类型一致性：** Agent 名称全部使用合并后的 9 个名字，路径全部使用 `{项目目录}/` 变量格式。
