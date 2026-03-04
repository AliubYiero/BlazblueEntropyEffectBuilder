# sectConfig 重构实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 sectConfig.ts 重构为 SectInfo 结构，并在 UI 的 sect-item 中显示具体技能名称

**Architecture:** 新增 SectInfo 接口和 sectList 数组作为配置中心，在 useSkillData.ts 中添加 getSkillsBySect 映射函数，Vue 组件调用该函数将技能用 `/` 连接显示

**Tech Stack:** Vue 3, TypeScript, Element Plus

---

## 前置依赖

- 项目已安装依赖 (`pnpm install` 已完成)
- 开发服务器可正常启动 (`pnpm dev`)

---

### Task 1: 重构 sectConfig.ts - 添加 SectInfo 接口和 sectList 数组

**Files:**
- Modify: `src/config/sectConfig.ts`

**Step 1: 备份并重构文件**

```typescript
/**
 * 派系列表 - 重构版
 * 包含详细的属性-流派-技能映射
 * */

// 属性类型
export type Attribute = '火' | '冰' | '电' | '毒' | '暗' | '光' | '刃';

/**
 * 流派信息接口
 * */
export interface SectInfo {
	attribute: Attribute;
	sect: string;
	skill: string[];
}

/**
 * 完整的流派列表，包含技能详情
 * */
export const sectList: SectInfo[] = [
	{
		attribute: '火',
		sect: '燃烧',
		skill: [ '普攻燃烧', '技能燃烧', '冲刺燃烧' ],
	},
	{
		attribute: '火',
		sect: '火弹',
		skill: [ '技能火弹', '传承技火弹' ],
	},
	{
		attribute: '火',
		sect: '火环',
		skill: [ '传承技火环' ],
	},
	{
		attribute: '火',
		sect: '地雷',
		skill: [ '放置地雷' ],
	},
	{
		attribute: '火',
		sect: '火精灵',
		skill: [ '火精灵助战' ],
	},
	{
		attribute: '冰',
		sect: '寒冷',
		skill: [ '普攻寒冷', '技能寒冷' ],
	},
	{
		attribute: '冰',
		sect: '寒冷 (寒气爆发)',
		skill: [ '普攻寒冷 (寒气爆发)', '技能寒冷 (寒气爆发)' ],
	},
	{
		attribute: '冰',
		sect: '寒冷 (聚寒成冰)',
		skill: [ '普攻寒冷 (聚寒成冰)', '技能寒冷 (聚寒成冰)' ],
	},
	{
		attribute: '冰',
		sect: '冰锥',
		skill: [ '冲刺冰锥', '传承技冰锥' ],
	},
	{
		attribute: '冰',
		sect: '冰刺',
		skill: [ '召唤冰刺' ],
	},
	{
		attribute: '冰',
		sect: '冰雹',
		skill: [ '技能冰雹', '传承技冰雹' ],
	},
	{
		attribute: '冰',
		sect: '玄冰剑刃',
		skill: [ '玄冰剑刃' ],
	},
	{
		attribute: '电',
		sect: '感电',
		skill: [ '技能感电', '传承技感电' ],
	},
	{
		attribute: '电',
		sect: '闪电链',
		skill: [ '普攻闪电', '技能闪电', '电闪雷鸣' ],
	},
	{
		attribute: '电',
		sect: '落雷',
		skill: [ '冲刺落雷' ],
	},
	{
		attribute: '电',
		sect: '电球',
		skill: [ '环绕电球' ],
	},
	{
		attribute: '电',
		sect: '电桩',
		skill: [ '传承技电桩' ],
	},
	{
		attribute: '毒',
		sect: '中毒',
		skill: [ '普攻淬毒', '技能毒环' ],
	},
	{
		attribute: '毒',
		sect: '史莱姆',
		skill: [ '召唤史莱姆' ],
	},
	{
		attribute: '毒',
		sect: '毒弹',
		skill: [ '冲刺毒弹' ],
	},
	{
		attribute: '毒',
		sect: '毒液',
		skill: [ '技能毒液', '传承技毒液' ],
	},
	{
		attribute: '毒',
		sect: '毒泡河豚',
		skill: [ '传承技河豚' ],
	},
	{
		attribute: '暗',
		sect: '触手',
		skill: [ '召唤触手' ],
	},
	{
		attribute: '暗',
		sect: '影子',
		skill: [ '冲刺影子' ],
	},
	{
		attribute: '暗',
		sect: '影刺',
		skill: [ '普攻影刺', '技能影刺' ],
	},
	{
		attribute: '暗',
		sect: '黑洞',
		skill: [ '传承技黑洞' ],
	},
	{
		attribute: '暗',
		sect: '暗影标记',
		skill: [ '普攻影标', '技能影标' ],
	},
	{
		attribute: '光',
		sect: '光枪',
		skill: [ '技能光枪', '传承技光枪' ],
	},
	{
		attribute: '光',
		sect: '闪光',
		skill: [ '传承技闪光' ],
	},
	{
		attribute: '光',
		sect: '光波',
		skill: [ '普攻光波' ],
	},
	{
		attribute: '光',
		sect: '光阵',
		skill: [ '召唤光阵' ],
	},
	{
		attribute: '光',
		sect: '圣光标记',
		skill: [ '圣光标记' ],
	},
	{
		attribute: '刃',
		sect: '飞剑',
		skill: [ '冲刺飞剑' ],
	},
	{
		attribute: '刃',
		sect: '撕裂',
		skill: [ '普攻撕裂', '技能撕裂' ],
	},
	{
		attribute: '刃',
		sect: '刃环',
		skill: [ '召唤刃环' ],
	},
	{
		attribute: '刃',
		sect: '刀刃风暴',
		skill: [ '技能风暴', '传承技风暴' ],
	},
	{
		attribute: '刃',
		sect: '飞刃',
		skill: [ '普攻飞刃' ],
	},
];

/**
 * 旧版配置 - 保留用于向后兼容
 * 格式: { 属性: [流派数组] }
 * */
export const sectConfig: Record<Attribute, string[]> = {
	'火': [ '燃烧', '火弹', '火环', '地雷', '火精灵' ],
	'冰': [ '寒冷', '寒冷 (寒气爆发)', '寒冷 (聚寒成冰)', '冰锥', '冰刺', '冰雹', '玄冰剑刃' ],
	'电': [ '感电', '闪电链', '落雷', '电球', '电桩' ],
	'毒': [ '中毒', '史莱姆', '毒弹', '毒液', '毒泡河豚' ],
	'暗': [ '触手', '影子', '影刺', '黑洞', '暗影标记' ],
	'光': [ '光枪', '闪光', '光波', '光阵', '圣光标记' ],
	'刃': [ '飞剑', '撕裂', '刃环', '刀刃风暴', '飞刃' ],
};

/**
 * 根据流派名获取技能列表字符串
 * @param sectName 流派名称
 * @returns 技能列表字符串，用 / 分隔；如果找不到则返回原流派名
 * */
export const getSkillsBySect = (sectName: string): string => {
	const sectInfo = sectList.find(s => s.sect === sectName);
	return sectInfo ? sectInfo.skill.join('/') : sectName;
};
```

**Step 2: 验证 TypeScript 编译**

Run: `npx vue-tsc --noEmit`
Expected: 无错误

**Step 3: Commit**

```bash
git add src/config/sectConfig.ts
git commit -m "refactor(config): restructure sectConfig with SectInfo interface and getSkillsBySect helper"
```

---

### Task 2: 更新 useSkillData.ts - 使用新的配置

**Files:**
- Modify: `src/composables/useSkillData.ts`

**Step 1: 更新导入语句**

将 `import { sectConfig } from '../config/sectConfig.ts';`
替换为 `import { sectConfig, sectList, getSkillsBySect, type Attribute, type SectInfo } from '../config/sectConfig.ts';`

**Step 2: 在 return 对象中添加辅助函数**

在 `return { ... }` 中添加：
```typescript
return {
	// ... 原有属性
	getSkillsBySect,
	sectList,
};
```

**Step 3: 验证 TypeScript 编译**

Run: `npx vue-tsc --noEmit`
Expected: 无错误

**Step 4: Commit**

```bash
git add src/composables/useSkillData.ts
git commit -m "refactor(composables): export getSkillsBySect and sectList from useSkillData"
```

---

### Task 3: 更新 SearchDoubleEffectForm.vue - sect-item 显示 skills

**Files:**
- Modify: `src/components/SearchDoublePage/SearchDoubleEffectForm.vue`

**Step 1: 添加辅助方法**

在 `<script>` 中的 `styleMapper` 后添加：
```typescript
import { getSkillsBySect } from '../../config/sectConfig.ts';

// 在 setup 中
const getSkillDisplay = (sectName: string): string => {
	return getSkillsBySect(sectName);
};
```

**Step 2: 修改模板中的 sect-item 显示**

找到第 254 行和第 261 行的 sect-item 模板：

```vue
<!-- 之前 -->
<span class="sect-name">{{ skill.mainSect }}</span>

<!-- 之后 -->
<span class="sect-name">{{ getSkillDisplay(skill.mainSect) }}</span>
```

同样修改第二个 sect-item：
```vue
<!-- 之前 -->
<span class="sect-name">{{ skill.secondSect }}</span>

<!-- 之后 -->
<span class="sect-name">{{ getSkillDisplay(skill.secondSect) }}</span>
```

**Step 3: 验证 TypeScript 编译**

Run: `npx vue-tsc --noEmit`
Expected: 无错误

**Step 4: Commit**

```bash
git add src/components/SearchDoublePage/SearchDoubleEffectForm.vue
git commit -m "feat(ui): display skill names instead of sect names in SearchDouble page"
```

---

### Task 4: 更新 SelectableSkillCard.vue - sect-tag 显示 skills

**Files:**
- Modify: `src/components/SectBuilderPage/SelectableSkillCard.vue`

**Step 1: 添加导入和辅助方法**

在 `<script>` 中添加：
```typescript
import { getSkillsBySect } from '../../config/sectConfig.ts';

// 在 setup 中
const getSkillDisplay = (sectName: string): string => {
	return getSkillsBySect(sectName);
};
```

**Step 2: 修改模板中的 sect-tag 显示**

找到第 98 行和第 102 行的 sect-tag 模板：

```vue
<!-- 之前 -->
<span class="sect-tag">
	<span :class="['element-dot', `element-dot--${styleMapper[detail.mainAttribute]}`]"></span>
	{{ detail.mainSect }}
</span>

<!-- 之后 -->
<span class="sect-tag">
	<span :class="['element-dot', `element-dot--${styleMapper[detail.mainAttribute]}`]"></span>
	{{ getSkillDisplay(detail.mainSect) }}
</span>
```

同样修改第二个 sect-tag：
```vue
<!-- 之前 -->
<span class="sect-tag">
	<span :class="['element-dot', `element-dot--${styleMapper[detail.secondAttribute]}`]"></span>
	{{ detail.secondSect }}
</span>

<!-- 之后 -->
<span class="sect-tag">
	<span :class="['element-dot', `element-dot--${styleMapper[detail.secondAttribute]}`]"></span>
	{{ getSkillDisplay(detail.secondSect) }}
</span>
```

**Step 3: 验证 TypeScript 编译**

Run: `npx vue-tsc --noEmit`
Expected: 无错误

**Step 4: Commit**

```bash
git add src/components/SectBuilderPage/SelectableSkillCard.vue
git commit -m "feat(ui): display skill names instead of sect names in SectBuilder page"
```

---

### Task 5: 样式调整 - 适配更长的文本

**Files:**
- Modify: `src/components/SearchDoublePage/SearchDoubleEffectForm.vue`
- Modify: `src/components/SectBuilderPage/SelectableSkillCard.vue`

**Step 1: 调整 SearchDoubleEffectForm.vue 的 sect-name 样式**

找到 `.sect-name` 样式（约第 143 行），添加：
```scss
.sect-name {
	// ... 原有样式
	max-width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
```

**Step 2: 调整 SelectableSkillCard.vue 的 sect-tag 样式**

找到 `.sect-tag` 样式，添加：
```scss
.sect-tag {
	// ... 原有样式
	max-width: 180px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
```

**Step 3: Commit**

```bash
git add src/components/SearchDoublePage/SearchDoubleEffectForm.vue src/components/SectBuilderPage/SelectableSkillCard.vue
git commit -m "style(ui): add text overflow handling for skill names display"
```

---

### Task 6: 集成测试

**Files:**
- 所有修改过的文件

**Step 1: 启动开发服务器**

Run: `pnpm dev`
Expected: 服务器正常启动，控制台无错误

**Step 2: 验证双重词条筛选页**

1. 访问 http://localhost:5173/
2. 检查 sect-item 是否显示 skills（如"普攻燃烧/技能燃烧"而非"燃烧"）
3. 检查元素气泡和连接符是否正常显示

**Step 3: 验证流派构建页**

1. 访问 http://localhost:5173/#/builder
2. 点击技能位选择流派
3. 检查"可激活双重策略"列表中的 sect-tag 是否显示 skills

**Step 4: 验证边界情况**

1. 检查"寒冷 (寒气爆发)"是否正确显示为"普攻寒冷 (寒气爆发)/技能寒冷 (寒气爆发)"
2. 检查单技能流派（如火环）是否正确显示

**Step 5: Commit**

```bash
git add .
git commit -m "test: verify sect skill display works correctly"
```

---

## 总结

实施完成后：
- sectConfig.ts 包含新的 `SectInfo` 结构和 `getSkillsBySect` 函数
- UI 中的 sect-item 显示具体技能名称（用 `/` 分隔）
- 原有功能不受影响（向后兼容）
