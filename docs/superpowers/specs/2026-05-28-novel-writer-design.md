# novel-writer：统一网文写作 Skill 设计规格

> 整合 write_novel（13 Skills + 9 Hooks + 7 Agents）和 novel_any（6 Agents + 7 模块 Python 工具箱）
> 部署为 Hermes 原生 skill：`~/.hermes/skills/novel-writer/`

---

## 一、目录结构

```
~/.hermes/skills/novel-writer/
├── SKILL.md                        ← 统一入口：触发匹配 + 路由分发
├── README.md                       ← 用户快速入门
├── pyproject.toml                  ← pip install 支持
├── references/
│   ├── phases/                     ← 流程编排骨架
│   │   ├── outline.md              ← 大纲构思→角色设计
│   │   ├── writing.md              ← 逐章写作→连续性检查
│   │   └── polish.md               ← 精修审查→终稿输出
│   ├── writing/                    ← 写作子模块（4）
│   │   ├── story-long-write.md
│   │   ├── story-short-write.md
│   │   ├── workflow-daily.md
│   │   └── workflow-revision.md
│   ├── analysis/                   ← 拆文/扫描（4）
│   │   ├── story-long-analyze.md
│   │   ├── story-short-analyze.md
│   │   ├── story-long-scan.md
│   │   └── story-short-scan.md
│   ├── polish/                     ← 精修（3）
│   │   ├── story-review.md
│   │   ├── story-deslop.md
│   │   └── style-lint-workflow.md
│   ├── tools/                      ← 工程工具（4）
│   │   ├── story-import.md
│   │   ├── story-cover.md
│   │   ├── story-setup.md
│   │   └── browser-cdp.md
│   ├── hooks/                      ← Hooks 执行逻辑
│   │   └── hooks.md
│   ├── genre/
│   │   ├── genre-web.md
│   │   └── genre-trad.md
│   └── research/                   ← 调研参考
│       ├── market-scan.md
│       ├── biquge-scraping.md
│       ├── biquge-limitations.md
│       ├── douban-scraping.md
│       ├── trxs-scraping.md
│       ├── threshold-calibration.md
│       ├── tool-validation-pattern.md
│       ├── pipeline-usage.md
│       ├── python-env-setup.md
│       ├── playwright-wsl-setup.md
│       └── ... (其余现有 reference)
├── agents/                         ← 合并后 9 Agent
│   ├── story-architect.md
│   ├── character-designer.md
│   ├── narrative-writer.md
│   ├── consistency-checker.md
│   ├── polisher.md
│   ├── scene-specialist.md
│   ├── story-researcher.md
│   ├── story-explorer.md
│   └── logic-checker.md
├── novel_tools/                    ← 保持现有包结构（不动）
│   ├── cli.py
│   ├── stats/    (wordcount/pacing/rhythm)
│   ├── slop/     (analyzer/dictionary/scanner/cross_chapter)
│   ├── bible/    (model/character/foreshadow/world)
│   ├── consistency/ (names/timeline/structure/emotion)
│   ├── outline/  (parser/diff)
│   ├── style_lint/ (rules + data/cheatsheet_zh.json)
│   ├── pipeline/ (12文件：pipeline/scraper/analyzer/validator/db...)
│   └── data/     (anti_slop_zh.json + hanzi_strokes.json)
├── templates/
│   ├── project-web/
│   │   ├── context-brief.md
│   │   ├── 大纲/ 追踪/ 审查/
│   │   ├── 设定/ (角色/世界观/读者分析.md)
│   │   ├── 对标/       ← write_novel 增强
│   │   └── 参考资料/   ← write_novel 增强
│   └── project-trad/
└── scripts/
    ├── install-deps.sh
    └── playwright-setup.sh
```

---

## 二、入口路由设计

### 2.1 触发匹配（双层入口）

**第一层：斜杠命令（精确匹配）**

| 命令 | 意图 | 说明 |
|------|------|------|
| `/novel write` | writing (long) | 长篇写作（默认） |
| `/novel write-long` | writing (long) | 长篇写作 |
| `/novel write-short` | writing (short) | 短篇写作 |
| `/novel review` | review (full) | 多Agent审查（4 Agent） |
| `/novel review-lean` | review (lean) | 精简审查（2 Agent） |
| `/novel analyze` | analyze (long) | 长篇拆文（默认） |
| `/novel analyze-short` | analyze (short) | 短篇拆文 |
| `/novel scan` | market-scan | 市场扫描 |
| `/novel deslop` | deslop | 去AI味 |
| `/novel revise` | revise | 修改/重写章节 |
| `/novel outline` | outline | 大纲构思 |
| `/novel character` | character | 角色设计 |
| `/novel scene` | scene | 场景技法分析 |
| `/novel polish` | polish | 语言润色 |
| `/novel import` | import | 导入已有小说 |
| `/novel setup` | setup | 部署写作环境 |
| `/novel cover` | cover | 生成封面 |
| `/novel pipe` | pipeline | 跑pipeline |

**第二层：自然语言关键词（模糊匹配）**

| 关键词 | 意图 |
|--------|------|
| 「写小说」「开新书」 | writing (long) |
| 「写短篇」「短篇」 | writing (short) |
| 「继续写」「续写」 | writing (continue，触发上下文恢复) |
| 「继续」（独立使用） | writing (continue) |
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

匹配优先级：斜杠命令 > 精确关键词 > 模糊关键词。

### 2.2 路由分发逻辑

```
用户输入 → 正规化（命令/关键词 → 标准意图名） → 意图映射 → 粒度判断
  ┌── 轻量（单步操作，不跨文件）→ 内联执行
  ├── 动态（先轻后重）→ 先内联尝试，超阈值自动升级委派
  │     阈值：涉及章节 > 3 章 或 总字数 > 10000 字 → 触发升级
  └── 重量（多步/Agent协作/大量上下文）→ delegate_task 委派
```

### 2.3 粒度判断表

| 操作 | 粒度 | 方式 | Agent |
|------|------|------|-------|
| 去AI味（单章） | 轻量 | 内联 | — |
| 格式检查 | 轻量 | 内联 | — |
| 字数统计 | 轻量 | 内联 + Python | — |
| 对话润色 | 轻量 | 内联 | — |
| 章节起名 | 轻量 | 内联 | — |
| 单章审查 | 轻量 | 内联 | — |
| 伏笔查询 | 动态 | 先内联→无则委派 | consistency-checker |
| 节奏分析（单章） | 动态 | 先内联→多章则委派 | story-architect |
| 逐章写作 | 重量 | 委派 | narrative-writer |
| 修改/重写 | 重量 | 委派 | narrative-writer |
| 全文审查 (full) | 重量 | 委派（4 Agent并行） | consistency + logic + story-architect + polisher |
| 全文审查 (lean) | 重量 | 委派（2 Agent并行） | consistency + polisher |
| 全量拆文 | 重量 | 委派 | story-architect |
| 扫榜/市场调研 | 重量 | 委派 | story-researcher |
| pipeline 全流程 | 重量 | 委派 | — (Python) |
| 大纲构思 | 重量 | 委派 | story-architect |
| 角色设计 | 重量 | 委派 | character-designer |
| 世界观设计 | 重量 | 委派 | character-designer |
| 场景技法分析 | 重量 | 委派 | scene-specialist |
| 批量去AI味（多章） | 重量 | 委派 | polisher |
| 语言润色 | 轻量 | 内联 | — |
| 短篇写作 | 重量 | 委派 | narrative-writer |
| 短篇拆文 | 重量 | 委派 | story-architect |

### 2.4 委派模板

**变量来源：**
- `{项目目录}` = 当前 write_novel/ 目录
- `{书名}` = 从 `{项目目录}/追踪/上下文.md` 提取
- `{N}` = 用户输入数字，或上下文中的"当前章节"+1
- `{细纲路径}` = `{项目目录}/大纲/细纲_第{N}章.md`（不存在则提示先建细纲）

```python
# 写作
delegate_task(
  goal="写作《{书名}》第{N}章「{章名}」",
  context="项目路径: {项目目录}\n细纲: {细纲路径}\n加载 references/phases/writing.md + agents/narrative-writer.md",
  toolsets=["terminal", "file"]
)

# 审查 (full)
delegate_task(
  goal="对《{书名}》第{A}-{B}章执行全文审查",
  context="项目路径: {项目目录}\n加载 references/polish/story-review.md\n审查Agent: consistency-checker + logic-checker + story-architect + polisher",
  toolsets=["terminal", "file"]
)
```

### 2.5 委派结果反馈

统一格式：
1. 操作摘要（1-2句）
2. 关键发现/变更列表
3. 产出文件路径（如有文件写入）
4. 待处理问题（如有）
5. 「需要查看完整输出吗？」提示

---

## 三、Agent 体系

### 3.1 合并来源

```
novel_any (6)          write_novel (7)         →  merged (9)
─────────────────────────────────────────────────────────────
architect          +   story-architect        →  story-architect
narrator           +   narrative-writer       →  narrative-writer
character-designer     character-designer     →  character-designer (去重)
consistency-checker    consistency-checker    →  consistency-checker (去重)
polisher                                       →  polisher
scene-specialist                               →  scene-specialist
                       story-researcher        →  story-researcher
                       story-explorer          →  story-explorer
                       logic-checker           →  logic-checker
```

### 3.2 职责矩阵

| Agent | 职责 | 触发时机 | 工具权限 | maxTurns |
|-------|------|---------|---------|----------|
| **story-architect** | 题材定位→情绪定位→大纲展开；钩子/悬念/反转设计；情绪弧线；结构审查 | 开书/构思/审查 | Read, Write, Edit, Glob, Grep | 25 |
| **character-designer** | 角色档案/语言风格/动机链/人物弧线/关系网络/世界观设计 | 大纲后/审查/世界观 | Read, Write, Edit, Glob, Grep | 15 |
| **narrative-writer** | 逐章写作 + 内联去AI味（写作时实时执行）+ 格式合规 + 字数额度 | 写作/修改 | Read, Write, Edit, Glob, Grep | 25 |
| **consistency-checker** | **跨章事实一致性**：S1-S4分级，grep-first，角色属性/伏笔/时间线/世界规则（只读） | 每章后/审查 | Read, Glob, Grep | 15 |
| **logic-checker** | **章内逻辑细节**：P0-P6（时间线/场景身份/动作连贯/知识边界/能力/对话独白/视角）（只读） | 审查/修改后 | Read, Glob, Grep | 15 |
| **polisher** | 精修阶段批量去AI味 + 跨章风格统一 + 禁用词扫描 + 文风润色（优先用 novel-tools slop scan） | 精修/审查 | Read, Write, Edit, Glob, Grep | 15 |
| **scene-specialist** | 特定场景技法分析（打斗/对话/群像/情感/智斗）+ 输出技法建议文件 | 按需加载 | Read, Write, Glob, Grep | 10 |
| **story-researcher** | 市场调研/扫榜/对标分析；CDP优先，WebSearch兜底 | 开书前/扫榜 | Read, Bash, Write, Glob, Grep, WebSearch | 20 |
| **story-explorer** | 项目文件结构化查询（角色状态/伏笔进度/设定位置/时间线/写作进度）— 只读纯查询 | 写作前加载/审查前查询/用户提问 | Read, Glob, Grep | 15 |

### 3.3 关键边界

**consistency-checker vs logic-checker：**
```
consistency-checker（跨章）          logic-checker（章内）
─────────────────────────────────────────────────────
跨章角色属性不一致                  章内时间线错位
伏笔追踪/回收状态                   场景切换时身份混淆
时间线冲突（跨卷）                  动作连贯性断裂
世界规则违反                        角色知识边界越界
S1-S4 分级                          P0-P6 分级
```

novel_any 原有"逻辑检查维度"（因果/动机/规则自洽/信息传递/时空间）按跨章/章内拆分到两个 Agent。

**polisher vs narrative-writer 去AI味分工：**
```
narrative-writer：写作时内联 → 写完立即执行去AI味检查
polisher：精修时批量 → 跨章风格统一 + novel-tools slop scan 全量扫描
```

### 3.4 审查时的 Agent 协作

- **full 审查**：4 Agent 并行（consistency-checker + logic-checker + story-architect + polisher）
- **lean 审查**：2 Agent 并行（consistency-checker + polisher）
- **降级机制**：任一 Agent 失败 → 降为 lean；都失败 → 降为 solo
- Agent 独立并行，各自分析，审查协调器收集报告并交叉验证
- **平台依赖**：若 Hermes delegate_task 不支持并行，则降为顺序执行（不影响正确性）

### 3.5 Agent 工具权限映射

Agent prompt 中使用通用名称，Hermes 实际工具映射如下：

| Agent 权限名 | Hermes 工具 |
|-------------|------------|
| Read | read_file |
| Write | write_file |
| Edit | patch |
| Glob | search_files(target="files") |
| Grep | search_files(target="content") |
| Bash | terminal |
| WebSearch | web_search / web_fetch |

---

## 四、Python 工具箱

### 4.1 模块总览（保持现有包结构）

| 模块 | 功能 | 关键能力 |
|------|------|---------|
| stats | 字数/进度/对话描写比例/节奏密度/情绪曲线 | wordcount, pacing, rhythm |
| slop | AI味检测 + 跨章模板化检测 | TTR/句长变异/黑名单/Token rank/短语重复/cross_chapter |
| bible | 角色/世界观/伏笔 SQLite CRUD | character, foreshadow, world |
| consistency | 多模型情感曲线/跨章时间线/拼音模糊匹配 | names, timeline, structure, emotion |
| outline | 分层大纲校验 + TextRank 摘要 vs 大纲对比 | parser, diff |
| style_lint | 中文写作规范：冗余/陈词/模糊措辞/副词滥用/对话标签重复 | rules + data/cheatsheet_zh.json |
| pipeline | 6阶段自动化闭环：抓取→分析→验证→调研→改进→审查 | 12 文件子系统 |

> pipeline 阶段 4（调研）和阶段 5（改进）输出 JSON prompt 供 Agent 消费，需要 Agent 手动委派执行——不是全自动闭环。

### 4.2 调用方式

| 场景 | 方式 | 示例 |
|------|------|------|
| 轻量查询（单次） | 终端直接调用 | `python -m novel_tools.cli slop scan 第001章.md` |
| 组合查询 | Python 脚本 | stats + slop + consistency 三合一分析 |
| pipeline 全流程 | 委派子代理 | delegate_task 执行 `python -m novel_tools.pipeline.pipeline run --limit 5` |
| 写作后检查 | narrator workflow 内主动调用 | 每章写完后调 `slop scan` + `style_lint check` |
| 格式规范化 | 终端命令 | `novel-tools format <文件>` |

### 4.3 依赖安装

```bash
uv pip install --python ~/.hermes/hermes-agent/venv/bin/python \
  jieba snownlp pypinyin networkx cloudscraper playwright beautifulsoup4 lxml

playwright install chromium
```

### 4.4 已知阈值（v0.3.0 校准）

| 模块 | 指标 | 阈值 | 说明 |
|------|------|------|------|
| pacing | action_density | <15 = 节奏慢 | 值域 ~10-50。另检查 narration_ratio>0.75 |
| ai_score | total_score | >20 = AI味重 | 含 phrase_repetition 加权 |
| emotion | intensity_variance | <0.08 = 平淡 | 情绪波动标准差 |
| redundancy | summary.total | 长文本 >5 / 短文本 >1 = 啰嗦 | 短文本(<2000字)阈值自适应降低 |

### 4.5 与子模块集成点

| 子模块 | 调用工具 | 用途 |
|--------|---------|------|
| story-deslop | slop scan + style_lint check | 去AI味前定量预检，再定性润色 |
| story-review | stats + slop + consistency + bible foreshadow warn + consistency check | 审查前自动生成数据报告 + 伏笔预警 |
| story-long-write | bible foreshadow warn | 每章写作前检查待回收伏笔 |
| story-long-analyze | stats pacing + emotion | 拆文时自动计算对标作品的节奏和情绪数据 |
| pipeline | pipeline run | 定时 cron 跑全流程，生成改进报告 |

---

## 五、Phase 流程 & Hooks & 模板 & 恢复

### 5.1 Phase 流程

```
Step 0: 选题定位
  story-researcher → 题材推荐/对标分析/读者画像
  用户已有方向 → 跳过

Phase 1: 大纲构思 (outline.md)
  story-architect → character-designer
  产出 → 故事大纲 / 角色卡 / 章纲 / 项目模板

Phase 2: 写作执行 (writing.md)
  narrative-writer → consistency-checker (每章后)
  每 10 章 → checkpoint 深度全局审查
  → scene-specialist (按需)
  产出 → 正文章节 / 追踪更新 / 伏笔账本 / 会话日志追加

Phase 3: 精修审查 (polish.md)
  consistency-checker + polisher
  结构问题 → 退回 Phase 1（异常路径，非常规流程）
  产出 → 审查报告 / 精修正文 / 问题清单
```

### 5.2 Hooks 迁移（9→8）

| 原 Hook | Hermes 实现 | 说明 |
|---------|------------|------|
| session-start | SKILL.md 启动门禁 | 自动检测项目状态/伏笔预警 |
| session-end | Phase 2 追踪更新中追加会话日志 | narrator 写入 `追踪/会话日志.md` |
| pre-compact | SKILL.md compact 恢复段 | 恢复指导 |
| post-compact | SKILL.md compact 恢复段 | 同上 |
| format-novel | `novel-tools format` CLI | 机械操作走 Python，不走 LLM |
| detect-story-gaps | consistency-checker 委派 | 审查阶段自动触发 |
| validate-story-commit | 可选 git hook 脚本 | 用户按需安装 |
| sentinel | .story-deployed 文件 | story-setup 生成 |

### 5.3 项目模板

```
templates/
├── project-web/           ← 网文模板
│   ├── context-brief.md
│   ├── 大纲/ 追踪/ 审查/
│   ├── 设定/
│   │   ├── 角色/
│   │   ├── 世界观/
│   │   └── 读者分析.md   ← 合并读者画像+题材定位
│   ├── 对标/             ← write_novel 增强
│   └── 参考资料/         ← write_novel 增强
└── project-trad/          ← 传统文学（同上结构）
```

story-setup 子模块负责：检测项目状态 → 复制模板 → 填充占位符 → 生成 .story-deployed。

### 5.4 Compact 恢复上下文

```
compact 后按顺序加载：
1. context-brief.md                          — 全局快照（项目元信息/进度/核心角色速览）
2. {项目目录}/追踪/上下文.md                  — 写作位置/进度/待处理线索
3. {项目目录}/追踪/伏笔.md                    — 待回收伏笔
4. {项目目录}/追踪/角色状态.md                 — 角色当前状态快照
5. {项目目录}/大纲/细纲_第{N}章.md             — 写作目标
6. {项目目录}/正文/第{N}章_{章名}.md          — 文风/节奏锚点（前一章）
7. {项目目录}/审查/上次审查报告.md             — 已知问题
```

### 5.5 路径约定与迁移

全项目统一使用 `{项目目录}/` 变量路径，不写死 `novel/` 或 `{书名}/`。所有引用均使用变量格式。

**现有项目迁移**：当前 write_novel 项目使用 `novel/` 子目录嵌套结构（novel/正文/、novel/追踪/ 等）。实现时需将内容迁移到扁平结构（正文/、追踪/ 直接在项目根目录下），与 novel_any 模板约定统一。AGENTS.md 中的路径引用同步更新。

### 5.6 Agent 命名统一

| 旧名 (novel_any) | 新名 (novel-writer) |
|------------------|-------------------|
| architect | story-architect |
| narrator | narrative-writer |

---

## 六、完整用户链路模拟

```
开新书          → /novel write 或 "开新书"
                   → Step 0 story-researcher 调研定位
                   → Phase 1 story-architect 大纲构思
                   → character-designer 角色设计
                   → 大纲/角色存入项目目录

逐章写作        → /novel write 或 "继续写"
                   → compact 恢复上下文（7步）
                   → narrative-writer 写作
                   → consistency-checker 每章校验
                   → 每 10 章 checkpoint 深度审查

修改/重写       → /novel revise "第X章"
                   → narrative-writer 重写

审查            → /novel review (4 Agent) 或 /novel review-lean (2 Agent)

去AI味          → /novel deslop (批量 polisher) 或写作时 narrative-writer 内联

精修            → polisher 跨章风格统一 + style_lint

场景技法        → /novel scene "打斗场景分析"
                   → scene-specialist 输出技法建议

拆文对标        → /novel analyze "某本书"
                   → story-architect + stats pacing/emotion

扫榜调研        → /novel scan
                   → story-researcher (CDP优先)

角色设计        → /novel character "某角色"
                   → character-designer

世界观设计      → "世界观" / "背景设定"
                   → character-designer

Pipeline        → /novel pipe
                   → pipeline 6阶段自动化闭环

环境部署        → /novel setup
                   → story-setup 一键部署 hooks/rules/agents

导入已有小说    → /novel import
                   → story-import 逆向导入
```
