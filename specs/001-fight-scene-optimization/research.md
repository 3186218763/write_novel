# Research: 战斗场景全章优化

**Feature**: specs/001-fight-scene-optimization
**Date**: 2026-05-29
**Status**: Complete

## 决策记录

### R1: 扫描方法

**Decision**: 使用 multi-agent 并行扫描——5 个 agent 各负责 ~17 章，grep 提取战斗关键词行号，Read 确认段落实体，产出一致格式的 JSON 摘要，主线程合并。

**Rationale**: 84 章单线程扫描耗时长且消耗大量上下文。并行 agent 可将时间压缩至 ~1/5。

**Alternatives considered**:
- 单线程逐章 grep + read：可靠但慢，上下文易膨胀
- 纯 grep 自动判断：可能误判（关键词匹配 ≠ 战斗场景），需要 Read 确认

### R2: 回炉顺序

**Decision**: 按卷分批，卷内按优先级（重度→中度→轻度），同优先级按章节号升序。

**Rationale**:
- 按卷分批确保同一故事弧内的战斗风格一致（避免先修第 5 卷再修第 3 卷导致的不一致）
- 重度优先确保最大改进先完成
- 章节号升序符合阅读顺序，便于检查后果衔接

**Alternatives considered**:
- 全卷按优先级排序（不分卷）：可能导致跨卷跳跃，一致性风险高
- 纯章节号升序：轻度章节可能花时间，重度章节被推迟

### R3: 索引表与追踪文件的存放

**Decision**: 索引表和质量矩阵存放在 `specs/001-fight-scene-optimization/` 下，角色能力边界文档和敌人等级对照表更新到 `novel/设定/` 下（与现有设定文件一起）。

**Rationale**: 战斗元数据是本次优化的临时产物，放在 specs 目录下便于管理。能力边界和敌人设定是持久设定，应与现有设定文件共存。

**Alternatives considered**:
- 全部放 specs：设定文档日后难以发现
- 全部放 novel/设定：临时优化文件污染设定目录

### R4: 回炉编辑模式

**Decision**: 直接编辑原文件（in-place Edit），不创建副本。每章编辑后 git commit，以章为单位提交。

**Rationale**: 创建副本会导致 84+ 个临时文件的管理负担。Git 天然支持回滚，出问题可 revert。以章为单位 commit 保持 git 历史清晰。

**Alternatives considered**:
- 创建 `novel/正文_优化版/` 副本目录：安全但管理复杂，最终替换时易出错
- 全部改完一次性 commit：风险高，中间状态不可追溯

### R5: 审批与质量门

**Decision**: AI 按 10 项自查清单逐项自评，全部 ✓ 即通过。每章回炉后在 commit message 中附带自查结果摘要（✅8/10 等）。例外（<8/10）必须在 commit message 中注明原因。

**Rationale**: 用户选择全 AI 自主审批。commit message 附自查结果为日后人工抽查提供可追溯性。

**Alternatives considered**: 无——用户已在 clarify 阶段锁定此决策。

### R6: 参考手册的权威性层级

**Decision**: 战斗场景参考.md 的 11 个章节中，以下为硬约束（不可违背）：核心原则（零）、自查清单（十一）。以下为强指导（应遵循，有例外需注明原因）：四段式/三层结构（二）、三要素配比（三）、敌人辨识度（一）、多感官（五）。以下为弹性建议（按场景选用）：句式控制（2.4/2.5）、视角切换（5.1）、笑点植入（七）、对标技法（九/十）。

**Rationale**: 战斗参考手册内容庞大，全部当硬约束会导致过度修改。分层后保留核心原则的刚性，给技法留弹性空间。

**Alternatives considered**:
- 全部硬约束：可能导致为达标而生硬套用技法
- 全部弹性：失去标准的约束力
