# 流派清除按钮实现计划

>
*
*For
Claude:
** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

*
*Goal:
** 为技能流派卡片添加清除按钮，一键清除已选择的流派

*
*Architecture:
** 在 SkillCard.vue 组件中添加清除按钮 UI，调用 useBuilderStore 的 updateSkillCardInfo 方法传入空字符串清除流派配置

*
*Tech
Stack:
** Vue 3, TypeScript, Element Plus, SCSS

---

## Task 1: 导入 useBuilderStore 和图标

*
*Files:
**

- Modify:
  `src/components/SectBuilderPage/SkillCard.vue`

*
*Step
1:
在脚本顶部添加导入
**

找到现有的导入语句，添加以下内容：

```typescript
import { useBuilderStore } from '../../domains/builder/index.ts';
import { CircleClose } from '@element-plus/icons-vue';
```

*
*Step
2:
验证导入正确
**

检查文件：

-
`src/domains/builder/index.ts` 确认
`useBuilderStore` 已导出
- Element Plus 图标库已安装

*
*Step
3:
Commit
**

```bash
git add src/components/SectBuilderPage/SelectSkillCard.vue
git commit -m "chore: import useBuilderStore and CircleClose icon"
```

---

## Task 2: 添加清除按钮到模板

*
*Files:
**

- Modify:
  `src/components/SectBuilderPage/SkillCard.vue`

*
*Step
1:
在卡片容器内添加清除按钮
**

在
`<div class="skill-card">` 内部，
`<div class="card-icon">` 之前添加：

```vue
<el-button
	v-if="skillCardInfo.sect"
	class="clear-btn"
	type="danger"
	circle
	size="small"
	@click.stop="handleClear"
>
	<el-icon><CircleClose /></el-icon>
</el-button>
```

*
*Step
2:
验证位置正确
**

按钮应该位于：

- 卡片右上角
- 只在
  `skillCardInfo.sect` 有值时显示
- 使用
  `@click.stop` 阻止事件冒泡

*
*Step
3:
Commit
**

```bash
git add src/components/SectBuilderPage/SelectSkillCard.vue
git commit -m "feat: add clear button to SkillCard template"
```

---

## Task 3: 添加 handleClear 方法

*
*Files:
**

- Modify:
  `src/components/SectBuilderPage/SkillCard.vue`

*
*Step
1:
初始化
Store
**

在
`defineProps` 之后添加：

```typescript
const builderStore = useBuilderStore();
```

*
*Step
2:
添加
handleClear
方法
**

在
`handleClick` 方法之后添加：

```typescript
/**
 * 清除流派选择
 * */
const handleClear = () => {
	builderStore.updateSkillCardInfo( props.skillCardInfo.triggerName, '' );
};
```

*
*Step
3:
验证逻辑正确
**

- 传入当前触发位名称
- 传入空字符串表示清除

*
*Step
4:
Commit
**

```bash
git add src/components/SectBuilderPage/SelectSkillCard.vue
git commit -m "feat: add handleClear method to clear sect selection"
```

---

## Task 4: 添加清除按钮样式

*
*Files:
**

- Modify:
  `src/components/SectBuilderPage/SkillCard.vue`

*
*Step
1:
在
style
部分添加按钮样式
**

在
`.skill-card` 样式之后添加：

```scss
.clear-btn {
	position: absolute;
	top: 8px;
	right: 8px;
	opacity: 0.6;
	transition: opacity 0.15s ease;
	
	&:hover {
		opacity: 1;
	}
}
```

*
*Step
2:
确保卡片有相对定位
**

确认
`.skill-card` 已有
`position: relative`（如果没有则添加）：

```scss
.skill-card {
	position: relative;
	// 其他样式保持不变...
}
```

*
*Step
3:
验证样式语法
**

确保 SCSS 语法正确，无编译错误。

*
*Step
4:
Commit
**

```bash
git add src/components/SectBuilderPage/SelectSkillCard.vue
git commit -m "style: add clear button styling with hover effect"
```

---

## Task 5: 运行类型检查

*
*Files:
**

- 无文件修改

*
*Step
1:
运行
TypeScript
类型检查
**

```bash
pnpm vue-tsc --noEmit
```

*
*Step
2:
验证无错误
**

- 无类型错误
- 无缺少导入警告

*
*Step
3:
修复任何问题
**

如有错误，修复后重新运行类型检查。

*
*Step
4:
Commit（如需要）
**

```bash
git add src/components/SectBuilderPage/SelectSkillCard.vue
git commit -m "fix: resolve TypeScript type issues"
```

---

## Task 6: 运行开发服务器验证

*
*Files:
**

- 无文件修改

*
*Step
1:
启动开发服务器
**

```bash
pnpm dev
```

*
*Step
2:
手动测试验证
**

1. 打开浏览器访问
   `http://localhost:5173`
2. 切换到"流派构建"页面
3.
*
*验证按钮显示：
**
    - 为任意技能位选择一个流派
    - 确认清除按钮（红色圆形 X）出现在卡片右上角
4.
*
*验证清除功能：
**
    - 点击清除按钮
    - 确认流派被清除，卡片显示"点击选择"
    - 确认已激活策略列表更新
5.
*
*验证事件隔离：
**
    - 点击清除按钮时不应打开选择对话框
6.
*
*验证隐藏：
**
    - 清除后按钮应立即消失

*
*Step
3:
测试所有技能位
**

依次测试普攻、技能、冲刺、传承、召唤五个位置。

*
*Step
4:
Commit（如需要修复）
**

```bash
git add src/components/SectBuilderPage/SelectSkillCard.vue
git commit -m "fix: adjust clear button behavior based on testing"
```

---

## Task 7: 构建生产版本验证

*
*Files:
**

- 无文件修改

*
*Step
1:
运行构建
**

```bash
pnpm build
```

*
*Step
2:
验证构建成功
**

- 无 TypeScript 错误
- 无构建警告
-
`dist/` 目录生成成功

*
*Step
3:
Commit
**

```bash
git add dist/
git commit -m "chore: build production version with clear sect button"
```

---

## Summary

完成后的 SkillCard.vue 将具备：

1. ✅ 清除按钮在已选择流派时显示
2. ✅ 点击清除按钮清空当前技能位流派
3. ✅ 阻止事件冒泡，不触发卡片点击
4. ✅ 悬停效果提升用户体验
5. ✅ 清除后按钮自动隐藏

*
*最终验证清单：
**

- [ ] 类型检查通过
- [ ] 开发服务器运行正常
- [ ] 清除功能测试通过
- [ ] 事件隔离测试通过
- [ ] 生产构建成功
