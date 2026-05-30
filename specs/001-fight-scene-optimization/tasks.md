# Tasks: 战斗场景全章优化

**Input**: Design documents from `specs/001-fight-scene-optimization/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: 每场战斗回炉后 AI 按 10 项自查清单自评，不额外编写测试。

**Organization**: 按 User Story + Plan Phase 双维度组织，Phase 3-7 对应 US1-US5。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- 正文章节: `novel/正文/第XXX章_标题.md`
- 设定文件: `novel/设定/角色/角色名.md`、`novel/设定/世界观/魔女图鉴.md`
- 规格产出: `specs/001-fight-scene-optimization/`
- 参考手册: `novel/研究/战斗场景参考.md`（只读）
- 格式规则: `.claude/rules/story-format.md`、`.claude/rules/story-colloquial.md`（只读）

---

## Phase 1: Setup（项目初始化）

**Purpose**: 确认依赖文件存在、目录就绪

- [ ] T001 Verify all dependency files exist and readable: `novel/研究/战斗场景参考.md`, `.claude/rules/story-format.md`, `.claude/rules/story-colloquial.md`
- [ ] T002 Verify output directories exist: `specs/001-fight-scene-optimization/`, `novel/设定/角色/`, `novel/设定/世界观/`

---

## Phase 2: Foundational（阻塞前提 — 扫描前必须完成）

**Purpose**: 核心参考速查卡 + 已知角色/敌人快速审计，为 US1 扫描和 US2 回炉建立统一基准

**⚠️ CRITICAL**: US1 扫描和 US2 回炉依赖此阶段建立的基准判断标准

- [ ] T003 [P] Create combat checklist reference card from `novel/研究/战斗场景参考.md` Section 11: extract 10 items with pass/fail criteria per item, save to `specs/001-fight-scene-optimization/checklist-reference.md`
- [ ] T004 [P] Create enemy taxonomy quick reference from `novel/设定/世界观/魔女图鉴.md` and `novel/研究/战斗场景参考.md` Section 1: list all known enemies with name, tier, identifiable traits, first appearance chapter, save to `specs/001-fight-scene-optimization/enemy-roster-draft.md`
- [ ] T005 [P] Audit existing character ability descriptions in `novel/设定/角色/莫天.md`, `novel/设定/角色/莫宁梦.md`, `novel/设定/角色/唐雨.md`, `novel/设定/角色/沈知雾.md`, `novel/设定/角色/薇薇安.md`: note any existing ability boundary mentions, flag gaps, save to `specs/001-fight-scene-optimization/ability-audit.md`

**Checkpoint**: 基准建立完成 — 可以开始扫描和回炉

---

## Phase 3: US1 — 战斗场景目录与分类 (Priority: P1) 🎯 MVP

**Goal**: 产出完整战斗场景索引表 + 质量初评矩阵

**Independent Test**: 索引表覆盖全部 84 章，每场战斗有完整元数据（行号、字数、类型、敌人、画风、初评分数）

### 并行扫描（5 agents）

- [ ] T006 [P] [US1] Scan chapters 001-017 for combat scenes: grep keywords → Read confirmed paragraphs → extract metadata per data-model.md combat-index schema in `novel/正文/第001-017章/*.md`
- [ ] T007 [P] [US1] Scan chapters 018-034 for combat scenes: grep keywords → Read confirmed paragraphs → extract metadata per data-model.md combat-index schema in `novel/正文/第018-034章/*.md`
- [ ] T008 [P] [US1] Scan chapters 035-051 for combat scenes: grep keywords → Read confirmed paragraphs → extract metadata per data-model.md combat-index schema in `novel/正文/第035-051章/*.md`
- [ ] T009 [P] [US1] Scan chapters 052-068 for combat scenes: grep keywords → Read confirmed paragraphs → extract metadata per data-model.md combat-index schema in `novel/正文/第052-068章/*.md`
- [ ] T010 [P] [US1] Scan chapters 069-084 for combat scenes: grep keywords → Read confirmed paragraphs → extract metadata per data-model.md combat-index schema in `novel/正文/第069-084章/*.md`

### 合并与分类

- [ ] T011 [US1] Merge 5 agent scan outputs into unified `specs/001-fight-scene-optimization/combat-index.md`: deduplicate, cross-validate chapter coverage (all 84 chapters accounted for, mark "no combat" chapters), sort by chapter ID
- [ ] T012 [US1] For each battle in combat-index, run AI self-assessment against 10-item checklist (from checklist-reference.md), assign ✓/⚠/✗ per item, write `specs/001-fight-scene-optimization/quality-matrix.md`
- [ ] T013 [US1] Tag each battle with rework priority (重度 <6 / 中度 6-7 / 轻度 8-9 / 免修 10), battle type, and style label per data-model.md enums; update combat-index.md with tags
- [ ] T014 [US1] Generate priority-sorted work queue: 重度 first, grouped by volume (卷一~五), within each group by chapter order; append to `specs/001-fight-scene-optimization/combat-index.md` as `## Work Queue` section

**Checkpoint**: 索引表 + 质量矩阵 + 优先级队列就绪 — 可以开始逐章回炉

---

## Phase 4: US2 — 逐章回炉：按自查清单逐一修复 (Priority: P1)

**Goal**: 所有战斗 ≥8/10 自查通过率，核心战斗 10/10

**Independent Test**: 任意抽样 5 场优化后战斗，自查通过率 ≥ 80%

### 批次 1: 重度回炉（完整重写）

- [ ] T015 [US2] Batch 1 prep: extract all 重度 battles from combat-index work queue, group by volume, confirm per-battle strategy (四段式 vs 骑士三层 vs 心理战三段 per research.md R6)

- [ ] T016 [P] [US2] Rework 重度 battles in 卷一~二 (chapters 001-028): for each battle, follow quickstart.md example — Read original → apply FR-004~FR-013 per spec → self-assess 10 items → iterate max 3 rounds → Edit in-place → commit with score in message. Files in `novel/正文/第001-028章/*.md`
- [ ] T017 [P] [US2] Rework 重度 battles in 卷三 (chapters 029-043): same process, focus on four-stage structure for 污秽领主 battles and 心理战三段 for 海瑟 battle. Files in `novel/正文/第029-043章/*.md`
- [ ] T018 [P] [US2] Rework 重度 battles in 卷四 (chapters 044-063): same process. Files in `novel/正文/第044-063章/*.md`
- [ ] T019 [P] [US2] Rework 重度 battles in 卷五 (chapters 064-080): same process. Files in `novel/正文/第064-080章/*.md`

### 批次 2: 中度回炉（局部修补）

- [ ] T020 [P] [US2] Rework 中度 battles in 卷一~二 (chapters 001-028): patch missing elements (感官/视角/环境破坏/三步登场法), aim ≥9/10. Files in `novel/正文/第001-028章/*.md`
- [ ] T021 [P] [US2] Rework 中度 battles in 卷三 (chapters 029-043): same patch process. Files in `novel/正文/第029-043章/*.md`
- [ ] T022 [P] [US2] Rework 中度 battles in 卷四~五 (chapters 044-080): same patch process. Files in `novel/正文/第044-080章/*.md`

### 批次 3: 轻度回炉（微调）

- [ ] T023 [US2] Rework all 轻度 battles across all volumes: micro-adjustments only (e.g., add one sensory detail, one environmental damage line, one perspective switch). Files across `novel/正文/第001-084章/*.md`

### 例外处理

- [ ] T024 [US2] For battles that cannot reach 8/10 after 3 rework rounds: mark status=例外 in combat-index.md, document reason in exception_reason field, verify total 例外 ≤ 15% of all battles

### 回炉后更新

- [ ] T025 [US2] Update `specs/001-fight-scene-optimization/quality-matrix.md` with after-rework scores for all battles
- [ ] T026 [US2] Update `specs/001-fight-scene-optimization/combat-index.md` with after-rework scores, status, and commit SHAs

**Checkpoint**: 全部战斗回炉完成，平均自查通过率 ≥ 8/10，例外 ≤ 15%

---

## Phase 5: US3 — 战斗一致性校验 (Priority: P2)

**Goal**: 0 个 S1/S2 冲突，角色能力边界 + 敌人耐受力 + 魔法规则自洽

**Independent Test**: 运行一致性审查，S1/S2 = 0，S3 ≤ 3

- [ ] T027 [P] [US3] Extract per-character ability usage from all reworked chapters: for each character (莫天/莫宁梦/唐雨/沈知雾/薇薇安), list every ability instance with chapter, line range, description, limits mentioned, cost mentioned. Write to `specs/001-fight-scene-optimization/ability-inventory.md`
- [ ] T028 [US3] Cross-reference ability inventory: for each character, compare earliest vs latest ability usage — flag any contradictions (same ability with different limits/costs). Generate conflict list with S1-S4 severity. Write to `specs/001-fight-scene-optimization/consistency-report.md`
- [ ] T029 [P] [US3] Build enemy tolerance table: from combat-index + reworked chapters, extract each enemy's damage tolerance description. Compare same-tier enemies across chapters. Write final table to `specs/001-fight-scene-optimization/enemy-roster-draft.md` (update from Phase 2)
- [ ] T030 [US3] Fix all S1 (critical contradiction) and S2 (high inconsistency) issues found in T028 and T029 by editing affected chapters. Re-run check after fixes.
- [ ] T031 [US3] Update character setting files with finalized ability boundaries: edit `novel/设定/角色/莫天.md`, `novel/设定/角色/莫宁梦.md`, `novel/设定/角色/唐雨.md`, `novel/设定/角色/沈知雾.md`, `novel/设定/角色/薇薇安.md` — add or update ability boundary sections per ability-inventory.md
- [ ] T032 [US3] Update `novel/设定/世界观/魔女图鉴.md` with finalized enemy tier-tolerance table from T029
- [ ] T033 [US3] Verify magic system rules consistency across all reworked chapters: shadow attribute boundaries, magical girl transformation limits, saint bell trigger conditions. Add findings to consistency-report.md

**Checkpoint**: 0 S1/S2 conflicts, character settings and enemy roster updated

---

## Phase 6: US4 — 双线画风区分度审查 (Priority: P2)

**Goal**: 所有战斗画风标签正确，骑士线/魔法少女线风格不混合

**Independent Test**: 逐场战斗标注画风类别，骑士线无冗长痛苦描写/回合制对波，魔法少女线无单方面碾压

- [ ] T034 [US4] Audit knight-line battles (style=骑士线): for each, verify word count 300-800, fast rhythm, comedy present, finishing move with freeze-frame feel, no prolonged suffering descriptions. Flag violations in `specs/001-fight-scene-optimization/style-audit.md`
- [ ] T035 [US4] Audit magical-girl-line battles (style=魔法少女线): for each, verify word count 500-1200, back-and-forth flow, magic combat rhythm chain (天地异动→气场爆发→招式释放→效果炸裂→旁观者震惊), tension from first-strike vulnerability, no one-sided stomps (unless plot-required + cost justified). Flag violations in `specs/001-fight-scene-optimization/style-audit.md`
- [ ] T036 [US4] Fix all style violations found in T034-T035 by editing affected chapters
- [ ] T037 [US4] Verify alternating rhythm (松紧带效应) across chapters: check that knight/magical-girl battles alternate or juxtapose to create tension-release pattern. Document findings in style-audit.md

**Checkpoint**: All battles have correct style labels, no style mixing violations

---

## Phase 7: US5 — 章末后果与伏笔衔接 (Priority: P3)

**Goal**: 每场战斗后果与后续章节状态一致

**Independent Test**: 每场战斗有明确战后后果段落，与下一章角色出场状态一致

- [ ] T038 [US5] For each battle, verify post-battle consequences are present in-chapter: physical injury, mana depletion, or emotional shift (≥1 required per FR-013). Read battle-ending paragraphs and flag battles missing consequences. Write findings to `specs/001-fight-scene-optimization/consequence-check.md`
- [ ] T039 [US5] Cross-chapter continuity check: for each battle with consequences, read the next chapter's opening paragraphs for the same character — verify injury/depletion/emotional state carries forward. Flag any breaks. Add to consequence-check.md
- [ ] T040 [US5] Fix all consequence gaps found in T038-T039 by editing affected chapter endings/openings
- [ ] T041 [US5] Run story-explorer agent to verify foreshadowing entries related to combat discoveries (enemy weaknesses, ability discoveries, world-building clues) are tracked in `novel/追踪/伏笔.md`. Flag any untracked combat-discovered info

**Checkpoint**: All battles have consequences, all carry forward to next chapter, combat foreshadowing tracked

---

## Phase 8: Polish & Final Report

**Purpose**: 汇总全部优化成果，生成最终报告

- [ ] T042 [P] Generate `specs/001-fight-scene-optimization/optimization-report.md`: per-volume stats, per-type stats, before/after score distribution, dual-line style summary, consistency check results (S1-S4 counts), exception list with reasons, 3-5 highlight before/after cases
- [ ] T043 [P] Select 5 battles for reader sampling test per SC-006: recommend chapters with the most dramatic improvement + diverse battle types + spread across volumes. List in optimization-report.md
- [ ] T044 Verify all Success Criteria (SC-001 through SC-007): compute final numbers, confirm all SC pass, document in optimization-report.md
- [ ] T045 Run final `git log --oneline` for battle rework commits and append commit summary to optimization-report.md

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ────→ Phase 2 (Foundational) ────→ Phase 3 (US1: Scan)
                                                         ↓
                                                    Phase 4 (US2: Rework)
                                                    /        \
                                                   ↓          ↓
                                   Phase 5 (US3: Consistency)  Phase 6 (US4: Style)
                                            \                  /
                                             ↓                ↓
                                   Phase 7 (US5: Consequences)
                                             ↓
                                   Phase 8 (Polish & Report)
```

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS US1 and US2
- **Phase 3 (US1: Scan)**: Depends on Phase 2 completion — BLOCKS US2
- **Phase 4 (US2: Rework)**: Depends on Phase 3 completion — BLOCKS US3, US4, US5
- **Phase 5 (US3: Consistency)**: Depends on Phase 4 completion
- **Phase 6 (US4: Style)**: Depends on Phase 4 completion — can run in parallel with Phase 5
- **Phase 7 (US5: Consequences)**: Depends on Phase 5 + Phase 6 completion
- **Phase 8 (Polish)**: Depends on Phase 7 completion

### Within Each Phase

#### Phase 3 (US1)
- T006-T010: 5 scan agents run in **parallel** (different chapter ranges, no dependencies)
- T011: Depends on T006-T010 ALL complete (merge step)
- T012-T013: Depends on T011 complete (need unified index)
- T014: Depends on T012-T013 complete

#### Phase 4 (US2)
- T015: Setup task, no parallel dependencies
- T016-T019: **Parallel** (different volume ranges, non-overlapping files)
- T020-T022: Depends on all 重度 batch (T016-T019) complete in their respective volume, then **parallel** across volumes
- T023: Depends on all 中度 (T020-T022) complete
- T024-T026: Sequential after T023

#### Phase 5 (US3)
- T027, T029: **Parallel** (different data sources)
- T028: Depends on T027
- T030: Depends on T028 + T029
- T031, T032: **Parallel** after T030 (different files)
- T033: Independent, can run anytime during Phase 5

#### Phase 6 (US4)
- T034, T035: **Parallel** (different battle sets)
- T036: Depends on T034 + T035
- T037: Independent, can run after T036

#### Phase 7 (US5)
- T038, T041: **Parallel** (different data sources)
- T039: Depends on T038
- T040: Depends on T038 + T039

#### Phase 8 (Polish)
- T042, T043: **Parallel** (different report sections)
- T044: Depends on T042
- T045: Depends on T044

---

## Parallel Execution Examples

### Phase 3: 5-Agent Parallel Scan

```bash
# Launch all 5 scan agents simultaneously:
Agent: "Scan chapters 001-017 for combat scenes per T006"
Agent: "Scan chapters 018-034 for combat scenes per T007"
Agent: "Scan chapters 035-051 for combat scenes per T008"
Agent: "Scan chapters 052-068 for combat scenes per T009"
Agent: "Scan chapters 069-084 for combat scenes per T010"
```

### Phase 4: 重度 Batch Parallel

```bash
# After T015 prep, launch 4 volume agents in parallel:
Agent: "Rework 重度 battles in 卷一~二 (001-028) per T016"
Agent: "Rework 重度 battles in 卷三 (029-043) per T017"
Agent: "Rework 重度 battles in 卷四 (044-063) per T018"
Agent: "Rework 重度 battles in 卷五 (064-080) per T019"
```

### Phase 5: Consistency + Phase 6: Style Parallel

```bash
# After Phase 4 complete, run these two phases in parallel:
Agent: "Execute Phase 5 (US3 Consistency) tasks T027-T033"
Agent: "Execute Phase 6 (US4 Style Audit) tasks T034-T037"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup (2 tasks)
2. Complete Phase 2: Foundational (3 tasks)
3. Complete Phase 3: US1 Scan & Diagnosis (9 tasks)
4. **STOP and VALIDATE**: combat-index.md + quality-matrix.md produced, all 84 chapters covered
5. Review work queue before committing to full rework

### Incremental Delivery

1. Setup + Foundational → benchmarks ready
2. US1 (Scan) → index + quality matrix ready (first deliverable!)
3. US2 (Rework) → all battles ≥8/10, core battles 10/10
4. US3 (Consistency) + US4 (Style) → in parallel → 0 conflicts, style verified
5. US5 (Consequences) → all aftermath chains verified
6. Phase 8 (Report) → final optimization report

### Suggested MVP Scope

**US1 only** (Phase 1-3, tasks T001-T014): delivers the complete combat scene index with quality assessment. This alone provides immediate value — the author knows exactly which chapters need what level of work — and can decide whether to proceed with full rework or cherry-pick.

---

## Notes

- [P] tasks = different files or different data sources, no dependencies
- [Story] label maps task to spec user story for traceability
- Each user story phase is independently verifiable
- Agent-based tasks (T006-T010, T016-T019) expect the agent to do Read + Edit + self-assess
- Per research.md R4: all edits are in-place, git commit per chapter
- Per research.md R5: AI self-assesses, passing = commit, exception = document
- Per research.md R6: 核心原则 + 自查清单 are hard constraints; 四段结构/三要素/辨识度/多感官 are strong guidance; 句式/视角/笑点/对标技法 are flexible
- Stop at any checkpoint to validate independently before continuing
