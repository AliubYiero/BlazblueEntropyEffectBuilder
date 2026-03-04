# 流派触发位验证实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 修改技能流派对话框，禁用不属于当前触发位的流派选项

**Architecture:** 在 ChangeSkillSectForm.vue 组件中引入 `getValidTriggersForSect` 函数，为每个流派标签动态计算可用性状态，通过 `:disabled` 属性和 CSS 类实现禁用态UI

**Tech Stack:** Vue 3, TypeScript, Element Plus, SCSS

---

## Task 1: 引入 getValidTriggersForSect 函数

**Files:**
- Modify: `src/components/SectBuilderPage/ChangeSkillSectForm.vue`

**Step 1: 在脚本顶部添加导入**

找到现有的导入语句，在 `filterByTrigger` 后面添加 `getValidTriggersForSect`：

```typescript
import { filterByTrigger, getValidTriggersForSect } from '../../domains/skill/repository.ts';
```

**Step 2: 验证导入正确**

检查文件 `src/domains/skill/repository.ts` 确认 `getValidTriggersForSect` 已导出。

**Step 3: Commit**

```bash
git add src/components/SectBuilderPage/ChangeSkillSectForm.vue
git commit -m "chore: import getValidTriggersForSect for trigger validation"
```

---

## Task 2: 添加流派可用性判断辅助函数

**Files:**
- Modify: `src/components/SectBuilderPage/ChangeSkillSectForm.vue`

**Step 1: 在 setup 中添加辅助函数**

在 `styleMapper` 常量定义之前，添加以下函数：

```typescript
/**
 * 判断流派是否支持当前触发位
 * @param sect - 流派名称
 * @returns 是否可用
 */
const isSectAvailableForTrigger = ( sect: SectValue ): boolean => {
	if ( !sect ) return false;
	const validTriggers = getValidTriggersForSect( sect );
	return validTriggers.includes( props.triggerName );
};
```

**Step 2: 验证类型正确**

确保 `SectValue` 类型已导入，函数返回 boolean。

**Step 3: Commit**

```bash
git add src/components/SectBuilderPage/ChangeSkillSectForm.vue
git commit -m "feat: add isSectAvailableForTrigger helper function"
```

---

## Task 3: 修改 selectSect 函数添加可用性检查

**Files:**
- Modify: `src/components/SectBuilderPage/ChangeSkillSectForm.vue`

**Step 1: 更新 selectSect 函数**

将现有的 `selectSect` 函数修改为：

```typescript
/**
 * 选择流派
 * @param sect - 流派名称
 * @param skill - 所属双重策略信息
 * */
const selectSect = ( sect: SectValue, skill: SkillInfo ) => {
	// 检查流派是否支持当前触发位
	if ( !isSectAvailableForTrigger( sect ) ) {
		return;
	}
	formData.sect = sect;
};
```

**Step 2: 更新模板中的点击事件**

找到两个 `el-tag` 的 `@click` 绑定，传递 skill 参数：

```vue
<el-tag
	:class="['sect-tag', 'sect-tag--main', { 'is-selected': formData.sect === skill.mainSect }]"
	:disabled="!isSectAvailableForTrigger(skill.mainSect)"
	size="small"
	@click="selectSect(skill.mainSect, skill)"
>
```

和

```vue
<el-tag
	:class="['sect-tag', 'sect-tag--second', { 'is-selected': formData.sect === skill.secondSect }]"
	:disabled="!isSectAvailableForTrigger(skill.secondSect)"
	size="small"
	@click="selectSect(skill.secondSect, skill)"
>
```

**Step 3: Commit**

```bash
git add src/components/SectBuilderPage/ChangeSkillSectForm.vue
git commit -m "feat: add availability check to selectSect function"
```

---

## Task 4: 添加禁用态样式

**Files:**
- Modify: `src/components/SectBuilderPage/ChangeSkillSectForm.vue`

**Step 1: 在 style 部分添加禁用态样式**

在现有的 `.sect-tag` 样式之后，添加：

```scss
.sect-tag {
	cursor: pointer;
	transition: all 0.15s ease;
	display: flex;
	align-items: center;
	gap: 4px;
	
	&:hover {
		transform: translateY(-1px);
	}
	
	&.is-selected {
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
		border-color: hsl(var(--primary));
	}
	
	// 新增：禁用态样式
	&.is-disabled {
		opacity: 0.4;
		cursor: not-allowed;
		background: hsl(var(--secondary) / 0.5);
		border-color: hsl(var(--border) / 0.5);
		
		&:hover {
			transform: none;
		}
	}
}
```

**Step 2: 验证样式语法**

确保 SCSS 语法正确，无编译错误。

**Step 3: Commit**

```bash
git add src/components/SectBuilderPage/ChangeSkillSectForm.vue
git commit -m "style: add disabled state styling for sect tags"
```

---

## Task 5: 为禁用标签添加 Tooltip 提示

**Files:**
- Modify: `src/components/SectBuilderPage/ChangeSkillSectForm.vue`

**Step 1: 重构模板以支持 Tooltip**

将两个流派标签用 `el-tooltip` 包裹。修改主流派标签部分：

```vue
<div class="skill-sects">
	<el-tooltip
		:disabled="isSectAvailableForTrigger(skill.mainSect)"
		:content="`该流派不支持${props.triggerName}位`"
		placement="top"
	>
		<el-tag
			:class="['sect-tag', 'sect-tag--main', { 
				'is-selected': formData.sect === skill.mainSect,
				'is-disabled': !isSectAvailableForTrigger(skill.mainSect)
			}]"
			:disabled="!isSectAvailableForTrigger(skill.mainSect)"
			size="small"
			@click="selectSect(skill.mainSect, skill)"
		>
			<span :class="['element-dot', `element-dot--${styleMapper[skill.mainAttribute]}`]"></span>
			{{ skill.mainSect }}
		</el-tag>
	</el-tooltip>
	
	<el-tooltip
		:disabled="isSectAvailableForTrigger(skill.secondSect)"
		:content="`该流派不支持${props.triggerName}位`"
		placement="top"
	>
		<el-tag
			:class="['sect-tag', 'sect-tag--second', { 
				'is-selected': formData.sect === skill.secondSect,
				'is-disabled': !isSectAvailableForTrigger(skill.secondSect)
			}]"
			:disabled="!isSectAvailableForTrigger(skill.secondSect)"
			size="small"
			@click="selectSect(skill.secondSect, skill)"
		>
			<span :class="['element-dot', `element-dot--${styleMapper[skill.secondAttribute]}`]"></span>
			{{ skill.secondSect }}
		</el-tag>
	</el-tooltip>
</div>
```

**Step 2: 验证 Tooltip 只在禁用时显示**

- `:disabled` 属性控制 tooltip 的显示条件
- 当流派可用时，tooltip 不显示
- 当流派不可用时，显示 "该流派不支持{triggerName}位"

**Step 3: Commit**

```bash
git add src/components/SectBuilderPage/ChangeSkillSectForm.vue
git commit -m "feat: add tooltip for disabled sect tags explaining unavailability"
```

---

## Task 6: 运行开发服务器验证

**Files:**
- 无文件修改

**Step 1: 启动开发服务器**

```bash
pnpm dev
```

**Step 2: 手动测试验证**

1. 打开浏览器访问 `http://localhost:5173`
2. 切换到"流派构建"页面
3. 点击任意技能位（如"普攻"）打开对话框
4. **验证禁用态：**
   - 观察策略列表中的流派标签
   - 不支持"普攻"位的流派应显示为禁用态（透明度降低）
   - 鼠标悬停禁用标签，应显示 tooltip "该流派不支持普攻位"
5. **验证可用态：**
   - 支持当前触发位的流派应正常可点击
   - 点击后应更新"已选择"区域
6. **验证点击禁用标签：**
   - 点击禁用标签应无任何反应
   - 不应更新选择状态

**Step 3: 测试不同触发位**

依次测试：普攻、技能、冲刺、传承、召唤
- 每个位置打开对话框
- 确认禁用/可用状态符合预期
- 参考 `src/domains/config/constants.ts` 中的 `sectList` 验证

**Step 4: Commit（如需要修复）**

如发现问题，修复后提交：

```bash
git add src/components/SectBuilderPage/ChangeSkillSectForm.vue
git commit -m "fix: adjust disabled state behavior based on testing"
```

---

## Task 7: 构建生产版本验证

**Files:**
- 无文件修改

**Step 1: 运行构建**

```bash
pnpm build
```

**Step 2: 验证构建成功**

- 无 TypeScript 错误
- 无构建警告
- `dist/` 目录生成成功

**Step 3: Commit**

```bash
git add dist/
git commit -m "chore: build production version with trigger validation"
```

---

## Summary

完成后的 `ChangeSkillSectForm.vue` 将具备：

1. ✅ 引入 `getValidTriggersForSect` 函数
2. ✅ `isSectAvailableForTrigger` 辅助函数判断可用性
3. ✅ 流派标签根据可用性显示禁用态
4. ✅ 禁用标签有 tooltip 提示原因
5. ✅ 点击禁用标签无反应
6. ✅ 表单提交时仍保持原有验证

**最终验证清单：**
- [ ] 开发服务器运行正常
- [ ] 所有触发位测试通过
- [ ] 禁用态样式正确
- [ ] Tooltip 提示正确
- [ ] 生产构建成功
