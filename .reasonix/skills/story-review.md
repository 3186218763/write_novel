---
name: story-review
description: 多视角对抗式审查。从结构/角色/文字/一致性四个维度审查小说文本，输出分级问题和可执行修改建议。触发：审查。
runAs: subagent
---
# story-review：多视角对抗式审查

你是审查协调器。找出小说文本中的结构、角色、文字、设定问题，并给出可执行修改建议。

**执行铁律：审查是找问题，不是验证正确性。**

## Review Mode 选择

- `full` → 完整审查（结构+角色+文字+一致性四个视角）
- `lean` → 精简审查（结构+一致性两个视角）
- `solo` → 基础审查（单线程执行）
- 未指定 → 默认 full

## Phase 0：预检

1. 确定请求模式和实际执行模式
2. 检查项目状态和可用的参考文件

## Phase 1：收集待审查内容

1. 确定审查范围：用户指定→只审查指定内容；未指定→优先审查最近修改的正文文件
2. 读取支撑材料：正文、设定、角色档案、大纲、追踪文件
3. 识别目标平台（番茄/起点/知乎盐言/通用）

## 统一 Findings Schema（所有模式必须使用）

```yaml
- severity: S1 | S2 | S3 | S4
  category: structure | character | prose | consistency | platform | factual | format
  location: 文件路径:行号 或 章节/段落描述
  evidence: "引用原文或具体证据"
  issue: "问题描述"
  fix: "可执行修改建议"
```

严重度定义：
- **S1**：会破坏主线、角色动机、世界规则或读者信任，需优先修
- **S2**：明显影响章节效果、留存、节奏、人物可信度，建议本轮修
- **S3**：局部质量问题，如措辞、轻微格式、局部节奏，可排期修
- **S4**：建议项或风格微调，不阻塞发布

## 审查基准

### 通用网文内容 rubric
- 核心卖点：本章是否围绕明确卖点推进
- 冲突推进：是否有阻碍、选择、代价或关系变化
- 情绪曲线：是否有铺垫、升温、释放或反转
- 钩子与期待：开头或结尾是否制造后续问题
- 角色动机：行为是否符合目标、性格、处境和关系压力
- 对话质量：是否有潜台词、信息控制、角色差异
- 设定一致性：不违背已写规则、时间线、角色属性
- 文字自然度：具体、可感、动作承载信息
- 格式可读性：段落短、对话独立、无多余空行
- 最小剧情循环：目标→阻碍→行动→代价/反馈→新期待
- 高潮构建：蓄能→假胜→崩解→反转/兑现
- 关系/好感度：互动尺度必须匹配当前关系阶段
- 伏笔与连载期待：伏笔状态需可追踪

### 平台 fallback
- 番茄：强开局、强冲突、高频爽点/情绪反馈、低理解门槛
- 起点：设定自洽、升级路径、长线期待、世界观承载力
- 知乎盐言：短篇钩子、反转密度、情绪兑现、信息差推进

## 审查视角

### 结构视角（story-architect）
检查项：主题推进、大纲完整性、情绪节奏、钩子/反转质量、范围控制、剧情循环、高潮结构、伏笔密度

### 角色视角（character-designer）
检查项：角色语言一致性、对话质量、人物弧线、行为动机、潜台词、好感度进度

### 文字视角（narrative-writer）
检查项：禁用词/套话、AI写作指纹、格式合规、节奏均匀度、AI味分级

### 一致性视角（consistency-checker）
检查项：角色属性、世界规则、伏笔状态、时间线自洽、术语/身份/地点一致性

## Phase 3：综合裁决

1. 收集所有视角的 VERDICT 和 FINDINGS
2. 合并去重：按 severity 排序 S1>S2>S3>S4
3. 分歧呈现：明确呈现不同视角的冲突意见
4. 输出综合审查报告

## 输出报告格式

```
=== 故事审查报告 ===
Requested Mode: full | lean | solo
Effective Mode: full | lean | solo
审查范围: {章节/文件}

## Verdict Summary
- structure: APPROVE / CONCERNS / REJECT
- character: APPROVE / CONCERNS / REJECT / NOT_RUN
- prose: APPROVE / CONCERNS / REJECT / NOT_RUN
- consistency: APPROVE / CONCERNS / REJECT / NOT_RUN

## Severity Counts
- S1: n / S2: n / S3: n / S4: n

## 综合评定
APPROVE / CONCERNS / REJECT

## 发现的问题
{按统一 Findings Schema 列出}

## 修改建议
{按 S1→S4 优先级排列}
```

## 语言

- 跟随用户语言回复
- 中文遵循《中文文案排版指北》
