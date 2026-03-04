# 数据源整合实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 DoubleSkillInfoList.json 与 sectList 整合为单一数据源，使每个流派包含其参与的所有双重策略信息

**Architecture:** 扩展 SectInfo 接口添加 doubleSkills 字段，创建数据转换工具将现有的121条双重策略映射到对应流派，提供同步查询接口替代异步加载

**Tech Stack:** TypeScript, Vue 3, Vite

---

## 前置检查

**检查点1: 确认当前项目状态**
```bash
cd D:/Code/.project/3_blazblue_entropy_effect_builder
git status
```
Expected: 工作目录干净，无未提交更改

**检查点2: 确认现有数据文件**
- 确认 `src/data/DoubleSkillInfoList.json` 存在且包含121条记录
- 确认 `src/domains/config/constants.ts` 存在且包含 sectList

---

## Task 1: 更新类型定义 (types.ts)

**Files:**
- Modify: `src/domains/config/types.ts`

**Step 1: 添加 DoubleSkill 接口**

在 `SectSkill` 接口后添加：

```typescript
/**
 * 双重策略信息
 */
export interface DoubleSkill {
  /** 策略名称 */
  name: string;
  /** 搭档流派 */
  partnerSect: SectValue;
  /** 搭档属性 */
  partnerAttribute: Attribute;
  /** 触发位列表 */
  trigger: Trigger[];
  /** 效果描述 */
  description: string;
}
```

**Step 2: 更新 SectInfo 接口**

将现有接口：
```typescript
export interface SectInfo {
  /** 属性 */
  attribute: Attribute;
  /** 流派名称 */
  sect: SectValue;
  /** 技能列表 */
  skill: SectSkill[];
}
```

改为：
```typescript
export interface SectInfo {
  /** 属性 */
  attribute: Attribute;
  /** 流派名称 */
  sect: SectValue;
  /** 技能列表 */
  skill: SectSkill[];
  /** 双重策略列表 */
  doubleSkills: DoubleSkill[];
}
```

**Step 3: 验证 TypeScript 编译**

Run: `npx vue-tsc --noEmit`
Expected: 类型错误（sectList 缺少 doubleSkills 字段），这是预期的

**Step 4: Commit**

```bash
git add src/domains/config/types.ts
git commit -m "feat(types): add DoubleSkill interface and extend SectInfo with doubleSkills field"
```

---

## Task 2: 创建数据转换脚本

**Files:**
- Create: `scripts/transform-double-skills.ts`

**Step 1: 创建转换脚本**

```typescript
/**
 * 双重策略数据转换脚本
 * 将 DoubleSkillInfoList.json 转换为每个流派的 doubleSkills 数组
 */

import type { DoubleSkill } from '../src/domains/config/types';
import doubleSkillData from '../src/data/DoubleSkillInfoList.json';

interface RawDoubleSkill {
  name: string;
  mainSect: string;
  mainAttribute: string;
  secondSect: string;
  secondAttribute: string;
  trigger: string[];
  description: string;
}

/**
 * 转换双重策略数据
 * 为每个流派生成其参与的双重策略列表
 */
export function transformDoubleSkills(): Map<string, DoubleSkill[]> {
  const sectDoubleSkills = new Map<string, DoubleSkill[]>();
  const rawData = doubleSkillData as RawDoubleSkill[];

  for (const skill of rawData) {
    // 为主流派添加（搭档是副流派）
    const mainSkill: DoubleSkill = {
      name: skill.name,
      partnerSect: skill.secondSect,
      partnerAttribute: skill.secondAttribute as any,
      trigger: skill.trigger as any,
      description: skill.description,
    };

    if (!sectDoubleSkills.has(skill.mainSect)) {
      sectDoubleSkills.set(skill.mainSect, []);
    }
    sectDoubleSkills.get(skill.mainSect)!.push(mainSkill);

    // 为副流派添加（搭档是主流派）
    const secondSkill: DoubleSkill = {
      name: skill.name,
      partnerSect: skill.mainSect,
      partnerAttribute: skill.mainAttribute as any,
      trigger: skill.trigger as any,
      description: skill.description,
    };

    if (!sectDoubleSkills.has(skill.secondSect)) {
      sectDoubleSkills.set(skill.secondSect, []);
    }
    sectDoubleSkills.get(skill.secondSect)!.push(secondSkill);
  }

  return sectDoubleSkills;
}

/**
 * 生成 TypeScript 格式的 doubleSkills 数组代码
 */
export function generateDoubleSkillsCode(sectName: string): string {
  const allSkills = transformDoubleSkills();
  const skills = allSkills.get(sectName) || [];

  if (skills.length === 0) {
    return 'doubleSkills: [],';
  }

  const lines = skills.map(skill => {
    return `    { name: '${skill.name}', partnerSect: '${skill.partnerSect}', partnerAttribute: '${skill.partnerAttribute}', trigger: [${skill.trigger.map(t => `'${t}'`).join(', ')}], description: '${skill.description.replace(/'/g, "\\'")}' }`;
  });

  return `doubleSkills: [\n${lines.join(',\n')}\n  ],`;
}

// 如果直接运行此脚本，打印所有流派的 doubleSkills
if (import.meta.main) {
  const allSkills = transformDoubleSkills();
  console.log('转换完成，各流派的双重策略数量：');
  for (const [sect, skills] of allSkills.entries()) {
    console.log(`  ${sect}: ${skills.length} 条`);
  }
}
```

**Step 2: 验证脚本可以运行**

Run: `npx tsx scripts/transform-double-skills.ts`
Expected: 输出各流派的双重策略数量统计

**Step 3: Commit**

```bash
git add scripts/transform-double-skills.ts
git commit -m "feat(scripts): add double skill data transformation script"
```

---

## Task 3: 更新 constants.ts 添加 doubleSkills 数据

**Files:**
- Modify: `src/domains/config/constants.ts`

**Step 1: 运行转换脚本获取数据**

创建临时脚本来生成数据：
```typescript
// scripts/generate-data.ts
import { transformDoubleSkills } from './transform-double-skills';

const data = transformDoubleSkills();
console.log(JSON.stringify(Object.fromEntries(data), null, 2));
```

Run: `npx tsx scripts/generate-data.ts > scripts/double-skills-data.json`

**Step 2: 更新 sectList 中的每个流派**

为 sectList 中的每个流派添加 `doubleSkills` 字段。以"燃烧"为例：

```typescript
{
  attribute: '火',
  sect: '燃烧',
  skill: [
    { name: '普攻燃烧', trigger: '普攻' },
    { name: '技能燃烧', trigger: '技能' },
    { name: '冲刺燃烧', trigger: '冲刺' },
  ],
  doubleSkills: [
    { name: '火环燃烧', partnerSect: '火环', partnerAttribute: '火', trigger: ['传承'], description: '火环可使敌人燃烧，每秒收到 550 伤害' },
    { name: '火焰飞剑', partnerSect: '飞剑', partnerAttribute: '刃', trigger: ['冲刺'], description: '飞剑升级为火焰飞剑，命中后可使敌人燃烧，每秒收到 340 伤害' },
    { name: '燃烧爆弹', partnerSect: '火弹', partnerAttribute: '火', trigger: ['冲刺', '普攻', '技能'], description: '攻击燃烧的敌人时会发射火弹，每个火弹造成 600 伤害' },
    { name: '爆燃火弹', partnerSect: '火弹', partnerAttribute: '火', trigger: ['技能', '传承'], description: '火弹对燃烧的敌人的伤害提示 100%' },
    { name: '火精灵引爆', partnerSect: '火精灵', partnerAttribute: '火', trigger: ['普攻'], description: '火精灵命中燃烧的敌人时有 50% 概率使其爆炸，造成 1150 伤害' },
    { name: '地雷火焰', partnerSect: '地雷', partnerAttribute: '火', trigger: ['召唤'], description: '地雷爆炸后会残留火焰，对经过的敌人每秒造成 400 伤害' },
    { name: '燃气毒泡', partnerSect: '毒泡河豚', partnerAttribute: '毒', trigger: ['传承'], description: '燃烧敌人在毒泡中增加 50% 升空速度，额外受到每秒 800 的伤害' },
  ],
},
```

**注意**: 需要对全部36个流派执行此操作。

**Step 3: 验证 TypeScript 编译**

Run: `npx vue-tsc --noEmit`
Expected: 无错误

**Step 4: Commit**

```bash
git add src/domains/config/constants.ts
git commit -m "feat(constants): add doubleSkills data to all sects in sectList"
```

---

## Task 4: 更新工具函数 (utils.ts)

**Files:**
- Modify: `src/domains/config/utils.ts`

**Step 1: 导入 DoubleSkill 类型**

更新导入语句：
```typescript
import type { SectValue, SectSkill, DoubleSkill } from './types.ts';
```

**Step 2: 添加 getDoubleSkillsBySect 函数**

在文件末尾添加：

```typescript
/**
 * 获取流派参与的所有双重策略
 * @param sectName - 流派名称
 * @returns 双重策略数组，如果流派不存在返回空数组
 */
export function getDoubleSkillsBySect(sectName: SectValue): DoubleSkill[] {
  const sect = sectList.find(s => s.sect === sectName);
  return sect?.doubleSkills ?? [];
}

/**
 * 获取流派参与的特定属性的双重策略
 * @param sectName - 流派名称
 * @param partnerAttribute - 搭档属性
 * @returns 符合条件的双重策略数组
 */
export function getDoubleSkillsByPartnerAttribute(
  sectName: SectValue,
  partnerAttribute: Attribute
): DoubleSkill[] {
  const skills = getDoubleSkillsBySect(sectName);
  return skills.filter(s => s.partnerAttribute === partnerAttribute);
}
```

**Step 3: 验证函数导出**

更新 `index.ts` 确保新函数被导出：
```typescript
// src/domains/config/index.ts
export {
  getSkillsBySect,
  getAttributeBySect,
  getSectsByAttribute,
  isValidSect,
  getAllSectNames,
  getSectInfo,
  getDoubleSkillsBySect,
  getDoubleSkillsByPartnerAttribute,
} from './utils.ts';
```

**Step 4: 验证 TypeScript 编译**

Run: `npx vue-tsc --noEmit`
Expected: 无错误

**Step 5: Commit**

```bash
git add src/domains/config/utils.ts src/domains/config/index.ts
git commit -m "feat(utils): add getDoubleSkillsBySect and getDoubleSkillsByPartnerAttribute functions"
```

---

## Task 5: 更新数据仓库 (repository.ts)

**Files:**
- Modify: `src/domains/skill/repository.ts`

**Step 1: 更新双重策略查询接口**

找到现有的双重策略相关接口，改为从 sectList 查询：

```typescript
import { sectList } from '../config/constants.ts';
import type { DoubleSkill } from '../config/types.ts';

/**
 * 根据流派获取相关的双重策略
 * @param sectName - 流派名称
 * @returns 双重策略列表
 */
export function getDoubleSkillsBySect(sectName: string): DoubleSkill[] {
  const sect = sectList.find(s => s.sect === sectName);
  return sect?.doubleSkills ?? [];
}

/**
 * 获取所有双重策略（去重）
 * @returns 唯一双重策略列表
 */
export function getAllDoubleSkills(): DoubleSkill[] {
  const allSkills = new Map<string, DoubleSkill>();
  
  for (const sect of sectList) {
    for (const skill of sect.doubleSkills) {
      // 使用策略名称作为键去重
      if (!allSkills.has(skill.name)) {
        allSkills.set(skill.name, skill);
      }
    }
  }
  
  return Array.from(allSkills.values());
}
```

**Step 2: 移除异步加载代码**

如果 repository.ts 中有异步加载 `DoubleSkillInfoList.json` 的代码，将其移除或标记为废弃。

**Step 3: 验证 TypeScript 编译**

Run: `npx vue-tsc --noEmit`
Expected: 无错误

**Step 4: Commit**

```bash
git add src/domains/skill/repository.ts
git commit -m "refactor(repository): update double skill queries to use sectList data"
```

---

## Task 6: 构建验证

**Files:**
- None (验证任务)

**Step 1: 完整构建**

Run: `pnpm build`
Expected: 构建成功，无错误

**Step 2: 检查输出**

确认 `dist/` 目录生成正确，所有资源文件存在。

**Step 3: Commit**

```bash
git commit -m "chore: verify build passes with integrated data source" --allow-empty
```

---

## Task 7: 清理临时文件

**Files:**
- Delete: `scripts/transform-double-skills.ts`
- Delete: `scripts/generate-data.ts` (如果创建了)
- Delete: `scripts/double-skills-data.json` (如果生成了)

**Step 1: 删除临时脚本**

```bash
rm -f scripts/transform-double-skills.ts
rm -f scripts/generate-data.ts
rm -f scripts/double-skills-data.json
```

**Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove temporary data transformation scripts"
```

---

## 最终验证清单

- [ ] `src/domains/config/types.ts` 包含 `DoubleSkill` 接口和扩展的 `SectInfo`
- [ ] `src/domains/config/constants.ts` 中所有36个流派都有 `doubleSkills` 字段
- [ ] `src/domains/config/utils.ts` 导出 `getDoubleSkillsBySect` 函数
- [ ] `src/domains/skill/repository.ts` 使用新的数据源
- [ ] `pnpm build` 成功
- [ ] 所有121条双重策略都正确分配到对应流派

---

## 回滚计划

如果实施过程中出现问题：

```bash
# 查看实施前的提交
git log --oneline -10

# 回滚到实施前的状态
git reset --hard <实施前的-commit-hash>

# 或者撤销最后一次提交但保留更改
git reset --soft HEAD~1
```

---

**计划完成时间**: 2026-03-04  
**预计实施时间**: 30-45 分钟
