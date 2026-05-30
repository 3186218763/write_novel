# Data Model: 战斗场景全章优化

**Feature**: specs/001-fight-scene-optimization
**Date**: 2026-05-29

## 核心实体

### 1. 战斗场景索引表 (combat-index)

扫描全章后产出的主索引，每行 = 一场战斗。

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `chapter_id` | string | 章节编号 | `第003章` |
| `chapter_title` | string | 章节标题 | `菜鸟初战` |
| `battle_seq` | int | 章内战斗序号（从1开始） | `1` |
| `line_start` | int | 战斗段落起始行号 | `34` |
| `line_end` | int | 战斗段落结束行号 | `133` |
| `word_count` | int | 战斗段落字数（含对话） | `650` |
| `participants` | string[] | 参战角色 | `["莫宁梦", "针线魔女"]` |
| `enemy_type` | string | 敌人类别 | `魔女/污秽/梦魇/圣女/其他` |
| `battle_type` | enum | 战斗类型 | 见下方类型枚举 |
| `style` | enum | 画风归属 | `骑士线/魔法少女线/混合/心理战` |
| `is_first_encounter` | bool | 是否首次遭遇此类型敌人 | `true` |
| `has_emotional_arc` | bool | 是否承载情感弧线 | `true` |
| `checklist_score_before` | int | 优化前自查通过项数 (0-10) | `4` |
| `checklist_score_after` | int | 优化后自查通过项数 (0-10) | `9` |
| `rework_priority` | enum | 回炉优先级 | `重度/中度/轻度/免修` |
| `rework_status` | enum | 回炉状态 | `待处理/已回炉/例外` |
| `exception_reason` | string? | 例外原因（仅 status=例外） | `过渡战，剧情限制` |
| `memory_point` | string | 优化后的记忆点描述 | `旧纽扣被砖头砸中→贯穿` |
| `commit_sha` | string? | 回炉后的 git commit hash | `a1b2c3d` |

**类型枚举 (battle_type)**:
- `骑士碾压战`: 莫天出场，快节奏，碾压
- `魔法少女成长战`: 莫宁梦主视角，有来有回
- `BOSS战`: 卷级重要敌人，完整四段式
- `心理战`: 非物理对抗（如海瑟的名字战）
- `群战`: 多人协作战斗
- `能力首秀`: 新能力/形态第一次登场

**画风枚举 (style)**:
- `骑士线`: 近身格斗 + 影能，快节奏，有笑点
- `魔法少女线`: 中远程拉扯 + 弹幕/陷阱，成长感
- `混合`: 骑士线+魔法少女线同时出现
- `心理战`: 非物理对抗，独立画风

### 2. 质量矩阵 (quality-matrix)

10 项自查清单 × 每场战斗的初评/终评，从 combat-index 的 `checklist_score_before/after` 字段派生详细记录。

| 字段 | 类型 | 说明 |
|------|------|------|
| `battle_key` | string | 外键，`{chapter_id}::battle{battle_seq}` |
| `item_1` to `item_10` | enum(before/after) | 每项自查指标的初评/终评结果：`✓/⚠/✗` |
| `notes` | string? | 针对特定未通过项的备注 |

### 3. 敌人等级-耐受力对照表 (enemy-roster)

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `enemy_id` | string | 唯一标识 | `needle-witch-001` |
| `name` | string | 敌人名称 | `针线魔女` |
| `category` | string | 大类 | `魔女` |
| `tier` | enum | 耐受力等级 | `杂兵/精英/领主/圣女级/特殊` |
| `first_appearance` | string | 首次出场章节 | `第003章` |
| `identifiable_traits` | string[] | 可识别特征（至少2项） | `["碎布拼合身体", "旧纽扣做脸", "黑线攻击"]` |
| `damage_tolerance` | string | 承受伤害能力描述 | `普通魔力弹可击散但可重组，纽扣是核心弱点` |
| `chapter_appearances` | string[] | 所有出场章节 | `["第003章"]` |

### 4. 角色能力边界文档 (ability-boundary)

更新到 `novel/设定/角色/` 下各角色文件的战斗能力部分。

| 字段 | 说明 | 示例 |
|------|------|------|
| `character` | 角色名 | `莫宁梦` |
| `abilities` | 能力清单 | `["魔力弹", "影子感知（觉醒中）", "影子形态（后期）"]` |
| `limits` | 限制条件 | `魔力见底后无法施法；变身需要吊坠；右臂旧伤影响握杖` |
| `costs` | 代价 | `魔力消耗 → 疲惫；影子使用过度 → 反噬风险` |
| `growth_arc` | 成长弧线 | `第003章菜鸟 → 第034章能配合封路 → 第042章完整影子形态` |
| `chapter_references` | 能力各阶段的章节出处 | `["第003章:首次变身+魔力弹", "第006章:被碾压", ...]` |

### 5. 战斗优化报告 (optimization-report)

最终交付物，汇总：

- 按卷统计：卷号、该卷战斗数、优化前平均分、优化后平均分、例外数
- 按类型统计：各 battle_type 的通过率变化
- 画风区分度总评
- 一致性校验结果摘要（S1-S4 分级冲突计数）
- 改进亮点：3-5 个最具代表性的前后对比案例

## 文件位置约定

```
specs/001-fight-scene-optimization/
├── spec.md                  # 规格
├── plan.md                  # 本实现计划
├── research.md              # 研究决策
├── data-model.md            # 本文件
├── quickstart.md            # 快速上手示例
├── combat-index.md          # 战斗场景索引表（Phase 1 扫描产出）
├── quality-matrix.md        # 质量矩阵（10项自查×每场战斗）
├── optimization-report.md   # 最终优化报告
└── checklists/
    └── requirements.md      # 规格质量检查清单

novel/设定/
├── 世界观/
│   └── 魔女图鉴.md          # 更新：补充敌人等级-耐受力信息
└── 角色/
    ├── 莫天.md              # 更新：补充能力边界
    ├── 莫宁梦.md            # 更新：补充能力边界+成长弧线
    ├── 唐雨.md              # 更新：补充能力边界
    ├── 沈知雾.md            # 更新：补充能力边界
    └── 薇薇安.md            # 更新：补充能力边界
```
