---
name: review-every-chapter
description: 每章写完必须跑 consistency-checker + logic-checker 审查，修复后再交差
metadata:
  type: feedback
---

每章写完必须跑 consistency-checker + logic-checker 审查。

**Why:** 第005章连续出现两个审查级bug（角色属性不一致「隐匿能力退步」、知识边界越界「绽放期」），都是写完没审查就直接交差导致的。

**How to apply:** 写完整章后，在报告「完成」之前，必须并行 spawn consistency-checker 和 logic-checker 对本章进行审查，修复所有S1-S2级问题后再交差。不要等用户提醒才跑审查。
