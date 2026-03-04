# sectConfig Tooltip 显示实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 修改 sect-item 显示方式：默认显示流派名，鼠标浮动时通过 tooltip 显示技能名

**Architecture:** 使用 Element Plus 的 el-tooltip 组件包裹流派名，content 绑定技能列表，使用 v-if 条件判断仅在技能列表非空时显示 tooltip

**Tech Stack:** Vue 3, TypeScript, Element Plus

---

## 前置依赖

- 已完成 Task 1-5（SectInfo 结构、getSkillsBySect 函数、样式调整）
- 开发服务器可正常启动 (`pnpm dev`)

---

### Task 1: 更新 SearchDoubleEffectForm.vue - 添加 Tooltip 显示

**Files:**
- Modify: `src/components/SearchDoublePage/SearchDoubleEffectForm.vue`

**Current implementation (relevant parts):**

Template (lines ~96-106):
```vue
<div class="sect-combo">
    <div class="sect-item">
        <span :class="['element-dot', `element-dot--${styleMapper[skill.mainAttribute]}`]"></span>
        <span class="sect-name">{{ getSkillDisplay(skill.mainSect) }}</span>
    </div>

    <span class="sect-connector">+</span>

    <div class="sect-item">
        <span :class="['element-dot', `element-dot--${styleMapper[skill.secondAttribute]}`]"></span>
        <span class="sect-name">{{ getSkillDisplay(skill.secondSect) }}</span>
    </div>
</div>
```

**Your task:**

将模板修改为使用 tooltip，默认显示流派名，tooltip 显示技能列表：

```vue
<div class="sect-combo">
    <div class="sect-item">
        <span :class="['element-dot', `element-dot--${styleMapper[skill.mainAttribute]}`]"></span>
        <template v-if="getSkillDisplay(skill.mainSect)">
            <el-tooltip :content="getSkillDisplay(skill.mainSect)" placement="top">
                <span class="sect-name">{{ skill.mainSect }}</span>
            </el-tooltip>
        </template>
        <template v-else>
            <span class="sect-name">{{ skill.mainSect }}</span>
        </template>
    </div>

    <span class="sect-connector">+</span>

    <div class="sect-item">
        <span :class="['element-dot', `element-dot--${styleMapper[skill.secondAttribute]}`]"></span>
        <template v-if="getSkillDisplay(skill.secondSect)">
            <el-tooltip :content="getSkillDisplay(skill.secondSect)" placement="top">
                <span class="sect-name">{{ skill.secondSect }}</span>
            </el-tooltip>
        </template>
        <template v-else>
            <span class="sect-name">{{ skill.secondSect }}</span>
        </template>
    </div>
</div>
```

**Steps:**
1. Update the template to wrap sect names with conditional el-tooltip
2. Default display shows sect name (skill.mainSect / skill.secondSect)
3. Tooltip content shows skill list via getSkillDisplay()
4. Use v-if to only show tooltip when skill list is not empty
5. Run TypeScript check: `npx vue-tsc --noEmit`
6. If no errors, commit with message: "feat(ui): show skill names in tooltip on hover for SearchDouble page"

---

### Task 2: 更新 SelectableSkillCard.vue - 添加 Tooltip 显示

**Files:**
- Modify: `src/components/SectBuilderPage/SelectableSkillCard.vue`

**Current implementation (relevant parts):**

Template (lines ~52-61):
```vue
<div class="sect-combo">
    <span class="sect-tag">
        <span :class="['element-dot', `element-dot--${styleMapper[detail.mainAttribute]}`]"></span>
        {{ getSkillDisplay(detail.mainSect) }}
    </span>
    <span class="sect-connector">+</span>
    <span class="sect-tag">
        <span :class="['element-dot', `element-dot--${styleMapper[detail.secondAttribute]}`]"></span>
        {{ getSkillDisplay(detail.secondSect) }}
    </span>
</div>
```

**Your task:**

将模板修改为使用 tooltip，默认显示流派名，tooltip 显示技能列表：

```vue
<div class="sect-combo">
    <span class="sect-tag">
        <span :class="['element-dot', `element-dot--${styleMapper[detail.mainAttribute]}`]"></span>
        <template v-if="getSkillDisplay(detail.mainSect)">
            <el-tooltip :content="getSkillDisplay(detail.mainSect)" placement="top">
                {{ detail.mainSect }}
            </el-tooltip>
        </template>
        <template v-else>
            {{ detail.mainSect }}
        </template>
    </span>
    <span class="sect-connector">+</span>
    <span class="sect-tag">
        <span :class="['element-dot', `element-dot--${styleMapper[detail.secondAttribute]}`]"></span>
        <template v-if="getSkillDisplay(detail.secondSect)">
            <el-tooltip :content="getSkillDisplay(detail.secondSect)" placement="top">
                {{ detail.secondSect }}
            </el-tooltip>
        </template>
        <template v-else>
            {{ detail.secondSect }}
        </template>
    </span>
</div>
```

**Steps:**
1. Update the template to wrap sect names with conditional el-tooltip
2. Default display shows sect name (detail.mainSect / detail.secondSect)
3. Tooltip content shows skill list via getSkillDisplay()
4. Use v-if to only show tooltip when skill list is not empty
5. Run TypeScript check: `npx vue-tsc --noEmit`
6. If no errors, commit with message: "feat(ui): show skill names in tooltip on hover for SectBuilder page"

---

### Task 3: 回滚 Task 5 的 overflow 样式（可选）

**Files:**
- Modify: `src/components/SearchDoublePage/SearchDoubleEffectForm.vue`
- Modify: `src/components/SectBuilderPage/SelectableSkillCard.vue`

由于现在默认只显示流派名，文本长度大幅减少，可以考虑回滚 Task 5 添加的 overflow 样式。但保留也无害，可根据实际情况决定。

**If you want to revert:**
Remove these properties from `.sect-name` and `.sect-tag`:
- max-width: 200px / 180px
- overflow: hidden
- text-overflow: ellipsis
- white-space: nowrap

**Steps:**
1. Decide whether to keep or remove the overflow styles
2. If removing, delete the overflow-related CSS properties
3. Run TypeScript check: `npx vue-tsc --noEmit`
4. Commit with message: "style(ui): remove overflow styles as text is now shorter"

---

### Task 4: 集成测试

**Files:**
- All modified files

**Step 1: 启动开发服务器**

Run: `pnpm dev`
Expected: 服务器正常启动，控制台无错误

**Step 2: 验证双重词条筛选页**

1. 访问 http://localhost:5173/
2. 检查默认显示是否为流派名（如"燃烧"而非"普攻燃烧/技能燃烧/冲刺燃烧"）
3. 鼠标浮动到流派名上，检查 tooltip 是否显示技能列表
4. 检查 tooltip 位置是否正确（placement="top"）

**Step 3: 验证流派构建页**

1. 访问 http://localhost:5173/#/builder
2. 点击技能位选择流派
3. 检查"可激活双重策略"列表中是否默认显示流派名
4. 鼠标浮动检查 tooltip 显示技能列表

**Step 4: 验证边界情况**

1. 检查单技能流派（如火环）是否正常显示
2. 检查带括号的流派名（如"寒冷 (寒气爆发)"）是否正常显示
3. 检查 tooltip 在技能列表为空时是否不显示

**Step 5: Commit**

```bash
git add .
git commit -m "test: verify tooltip skill display works correctly"
```

---

## 总结

实施完成后：
- 默认显示流派名称（如"燃烧"）
- 鼠标浮动显示技能列表 tooltip（如"普攻燃烧/技能燃烧/冲刺燃烧"）
- 技能列表为空时不显示 tooltip
- 所有原有功能保持不变
