# SkillCard 显示技能名实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 修改 SkillCard.vue 组件，使选择流派后显示对应的技能名称而非流派名称。

**Architecture:** 在组件层添加计算属性处理显示逻辑，根据 sect 和 triggerName 从 sectList 查找对应技能名。不修改数据流，仅改变视图层的显示内容。

**Tech Stack:** Vue 3, TypeScript, SCSS

---

## 前置信息

### 相关文件
- `src/components/SectBuilderPage/SkillCard.vue` - 需要修改的组件
- `src/domains/config/constants.ts` - sectList 数据源

### 数据结构
```typescript
// sectList 中的结构
{
  attribute: '暗',
  sect: '暗影标记',
  skill: [
    { name: '普攻影标', trigger: '普攻' },
    { name: '技能影标', trigger: '技能' },
  ],
}

// SkillCardInfo 结构
{
  triggerName: '普攻',  // 触发位
  sect: '暗影标记',    // 流派
  inherit: false,
}
```

---

## Task 1: 添加计算属性显示技能名

**Files:**
- Modify: `src/components/SectBuilderPage/SkillCard.vue`

**Step 1: 添加导入**

在 `<script>` 部分添加导入：

```typescript
import { computed } from 'vue';
import { sectList } from '../../domains/config/constants.ts';
```

**Step 2: 添加计算属性 displaySkillName**

在 `handleClear` 函数后添加：

```typescript
/**
 * 根据流派和触发位计算要显示的技能名
 * */
const displaySkillName = computed(() => {
	if (!props.skillCardInfo.sect) {
		return '';
	}

	// 查找流派信息
	const sectInfo = sectList.find(s => s.sect === props.skillCardInfo.sect);
	if (!sectInfo) {
		return props.skillCardInfo.sect;
	}

	// 查找当前触发位对应的技能
	const skill = sectInfo.skill.find(
		s => s.trigger === props.skillCardInfo.triggerName
	);

	// 返回技能名，找不到则返回流派名作为回退
	return skill ? skill.name : props.skillCardInfo.sect;
});
```

**Step 3: 更新模板显示**

将模板中的：
```vue
<span
  :class="['card-sect', { 'card-sect--empty': !skillCardInfo.sect }]">
  {{ skillCardInfo.sect ? skillCardInfo.sect : '点击选择' }}
</span>
```

改为：
```vue
<span
  :class="['card-sect', { 'card-sect--empty': !skillCardInfo.sect }]">
  {{ displaySkillName || '点击选择' }}
</span>
```

**Step 4: 验证修改**

运行开发服务器：
```bash
pnpm dev
```

打开浏览器访问 http://localhost:5173/builder

测试步骤：
1. 点击任意技能位卡片
2. 选择流派 "暗影标记"
3. 验证显示：
   - 普攻位应显示 "普攻影标"
   - 技能位应显示 "技能影标"
   - 其他位应显示 "暗影标记"（回退）

**Step 5: Commit**

```bash
git add src/components/SectBuilderPage/SkillCard.vue
git commit -m "feat: SkillCard 显示技能名替代流派名"
```

---

## 验证清单

- [ ] 普攻位选择暗影标记，显示"普攻影标"
- [ ] 技能位选择暗影标记，显示"技能影标"
- [ ] 空状态显示"点击选择"
- [ ] 未配置技能的触发位显示流派名（回退行为）
- [ ] 清除按钮功能正常
