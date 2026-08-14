# BlazBlue Entropy Effect Builder

一个《苍翼默示录：熵效应》的流派构建器，核心是双重策略的激活判定与筛选。数据模型以 `DoubleSkillInfoListV2.json` 为唯一策略数据源，流派命名以 `config/sectList` 为权威。

## Language

**双重策略 (Dual Strategy)**:
由两个流派组合而成的增益效果，当主、副条件在同一构建中同时满足时激活。
_Avoid_: 技能、skill、双重技能

**流派 (Sect)**:
构成策略的 36 种战斗风格之一，可装配于特定触发位。`config/sectList` 是流派命名的唯一权威，所有数据源（V2、UI、校验）必须与其对齐。
_Avoid_: style

**触发位 (Trigger Slot)**:
流派的 5 个固定装配位置：普攻、技能、冲刺、传承技、召唤。统一使用「传承技」，不使用「传承」。
_Avoid_: trigger、传承、slot

**属性 (Attribute)**:
7 种元素属性：火、冰、电、毒、暗、光、刃。
_Avoid_: element

**主条件 (Primary)**:
策略中作为效果源头的流派候选集。单侧总是单一流派，可出现在多个触发位。
_Avoid_: 主流派、mainSect

**副条件 (Secondary)**:
策略中作为效果落点的流派候选集。单侧总是单一流派，可出现在多个触发位。
_Avoid_: 副流派、secondSect

**激活 (Activation)**:
一项双重策略的成立状态：主条件与副条件各有一个候选被装配，且其中至少一个装配在 `triggerSlots` 声明的触发位上。
_Avoid_: 触发、生效

**继承 (Inherit)**:
构建器中将一项双重策略指派到某个触发位，使其计入激活结果的三态勾选机制；单触发位策略会被自动继承。
_Avoid_: 继承上位
