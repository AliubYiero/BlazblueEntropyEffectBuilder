# Inherit Checkbox State Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix inherited dual strategies polluting other trigger positions' checkbox states by moving three-state logic into the store and basing it on naturally-activated skills only.

**Architecture:** Add a `calculatedSkills` computed getter (natural activations only, no inherited) and a `getCheckboxState` method to the builder store. Replace the view-layer `getCheckboxState` with calls to the store method.

**Tech Stack:** Vue 3, Pinia, TypeScript

---

### Task 1: Add `calculatedSkills` getter to store

**Files:**
- Modify: `src/domains/builder/store.ts:44-72` (Getters section)

**Step 1: Add `calculatedSkills` computed after `readOnlyCardList`**

Insert after line 51 (`const readOnlyCardList = ...`) and before the existing `activatedSkills` computed (line 56):

```ts
  /**
   * 自然激活的策略（不含继承）
   * @description 仅通过流派配置自然激活的双重策略，用于三态判断
   */
  const calculatedSkills = computed<SkillInfo[]>(() => {
    return calculateActivatedSkills(skillCardInfoList.value).skills;
  });
```

**Step 2: Verify no type errors**

Run: `npx vue-tsc --noEmit`
Expected: No errors related to `calculatedSkills`

---

### Task 2: Add `getCheckboxState` method to store

**Files:**
- Modify: `src/domains/builder/store.ts:88` (Actions section)

**Step 1: Add `getCheckboxState` at the end of the Actions section**

Insert before the `return {` block (line 284), after `importConfiguration`:

```ts
  /**
   * 获取触发位的勾选框三态状态
   * @description 基于自然激活策略计算，继承的策略不影响其他触发位
   * @param trigger - 触发位名称
   * @returns 'checked' | 'pending' | 'unchecked'
   */
  const getCheckboxState = (trigger: Trigger): 'checked' | 'pending' | 'unchecked' => {
    const card = skillCardInfoList.value.find((c) => c.triggerName === trigger);
    if (card?.inherit) return 'checked';

    const related = calculatedSkills.value.filter((s) => s.trigger.includes(trigger));
    if (related.length === 0) return 'unchecked';

    for (const skill of related) {
      if (skill.trigger.length === 1) return 'checked';

      const otherTriggers = skill.trigger.filter((t) => t !== trigger);
      const allOthersChecked = otherTriggers.every((t) => {
        const otherCard = skillCardInfoList.value.find((c) => c.triggerName === t);
        return otherCard?.inherit;
      });
      if (allOthersChecked) return 'checked';
    }

    return 'pending';
  };
```

**Step 2: Export `getCheckboxState` and `calculatedSkills` from the return block**

Add to the return object in the Getters section:

```ts
    calculatedSkills,
```

Add to the return object in the Actions section:

```ts
    getCheckboxState,
```

**Step 3: Verify no type errors**

Run: `npx vue-tsc --noEmit`
Expected: No errors

---

### Task 3: Replace view-layer `getCheckboxState` with store method

**Files:**
- Modify: `src/views/SectBuilderPage.vue:197-222` (script section)

**Step 1: Delete the local `getCheckboxState` function and its helpers**

Remove lines 197-222 (the `getCheckboxState` function, `isInheritChecked`, and `isInheritPending`):

```ts
// DELETE THIS ENTIRE BLOCK (lines 197-222):
/**
 * 获取 checkbox 三态状态
 */
const getCheckboxState = ( trigger: Trigger ): 'checked' | 'pending' | 'unchecked' => {
	const card = builderStore.getSkillCardByTrigger( trigger );
	if ( card?.inherit ) return 'checked';

	const related = activatedSkills.value.filter( s => s.trigger.includes( trigger ) );
	if ( related.length === 0 ) return 'unchecked';

	for ( const skill of related ) {
		if ( skill.trigger.length === 1 ) return 'checked';

		const otherTriggers = skill.trigger.filter( t => t !== trigger );
		const allOthersChecked = otherTriggers.every( t => {
			const otherCard = builderStore.getSkillCardByTrigger( t );
			return otherCard?.inherit;
		} );
		if ( allOthersChecked ) return 'checked';
	}

	return 'pending';
};

const isInheritChecked = ( trigger: Trigger ) => getCheckboxState( trigger ) === 'checked';
const isInheritPending = ( trigger: Trigger ) => getCheckboxState( trigger ) === 'pending';
```

**Step 2: Replace with store-backed helpers**

Insert in the same location:

```ts
const isInheritChecked = ( trigger: Trigger ) => builderStore.getCheckboxState( trigger ) === 'checked';
const isInheritPending = ( trigger: Trigger ) => builderStore.getCheckboxState( trigger ) === 'pending';
```

**Step 3: Update `handleInheritClick` to use store method**

Replace lines 227-237:

```ts
const handleInheritClick = ( trigger: Trigger ) => {
	const state = builderStore.getCheckboxState( trigger );
	if ( state === 'checked' ) {
		builderStore.clearInheritSkill( trigger );
	}
	else {
		// pending 或 unchecked -> 打开继承对话框
		currentInheritTrigger.value = trigger;
		isShowInheritDialog.value = true;
	}
};
```

**Step 4: Verify no type errors**

Run: `npx vue-tsc --noEmit`
Expected: No errors

---

### Task 4: Manual verification and commit

**Step 1: Start dev server and test**

Run: `npm run dev`

Test scenario:
1. Configure 2 sects on 2 different trigger positions
2. Observe that a dual strategy activates and its checkbox shows `pending` for involved triggers
3. Click a pending checkbox and select the inherited dual strategy
4. **Verify fix:** Only the selected trigger's checkbox becomes `checked`. Other trigger positions of the same skill do NOT become `pending` or `checked`
5. Verify unchecking works correctly

**Step 2: Commit**

```bash
git add src/domains/builder/store.ts src/views/SectBuilderPage.vue
git commit -m "fix: 修复继承双重策略污染其他触发位勾选状态的问题

将三态逻辑从 SectBuilderPage.vue 下沉到 store，基于 calculatedSkills（仅自然激活策略）
而非 activatedSkills（含继承策略）进行判断，避免继承的策略影响其他触发位的状态。"
```
