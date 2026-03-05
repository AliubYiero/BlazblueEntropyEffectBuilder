# CSS 变量 HSL 格式重构实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将项目中所有 CSS 变量从分开的 HSL 分量格式改为直接的 `hsl()` 函数格式，并同步更新所有使用方。

**Architecture:** 纯样式重构，修改 9 个 Vue 文件的 `<style>` 部分，保持原有视觉不变。

**Tech Stack:** Vue 3, SCSS, CSS Variables

---

## Task 1: 修改 App.vue 中的 CSS 变量定义

**Files:**
- Modify: `src/App.vue:10-66`

**Step 1: 修改 :root 中的变量定义**

将 `:root` 中的 27 个 CSS 变量从 `H S L` 格式改为 `hsl(H S L)` 格式：

```scss
:root {
	/* 基础颜色 (HSL 格式) */
	--background: hsl(0 0% 100%);
	--foreground: hsl(222.2 84% 4.9%);
	--card: hsl(0 0% 100%);
	--card-foreground: hsl(222.2 84% 4.9%);
	--popover: hsl(0 0% 100%);
	--popover-foreground: hsl(222.2 84% 4.9%);
	--primary: hsl(222.2 47.4% 11.2%);
	--primary-foreground: hsl(210 40% 98%);
	--secondary: hsl(210 40% 96.1%);
	--secondary-foreground: hsl(222.2 47.4% 11.2%);
	--muted: hsl(210 40% 96.1%);
	--muted-foreground: hsl(215.4 16.3% 46.9%);
	--accent: hsl(210 40% 96.1%);
	--accent-foreground: hsl(222.2 47.4% 11.2%);
	--destructive: hsl(0 84.2% 60.2%);
	--destructive-foreground: hsl(210 40% 98%);
	--border: hsl(214.3 31.8% 91.4%);
	--input: hsl(214.3 31.8% 91.4%);
	--ring: hsl(222.2 84% 4.9%);
	--radius: 0.5rem;
	
	/* 元素颜色 - 用于小圆点标识 */
	--element-fire: hsl(0 84% 60%);
	--element-ice: hsl(199 89% 48%);
	--element-thunder: hsl(48 96% 53%);
	--element-poison: hsl(271 91% 65%);
	--element-dark: hsl(258 90% 66%);
	--element-light: hsl(45 93% 47%);
	--element-blade: hsl(215 16% 47%);
	
	/* 字体 */
	--font-sans: 'Inter', 'Noto Sans SC', system-ui, sans-serif;
	--font-chinese: 'Noto Sans SC', sans-serif;
}
```

**Step 2: 修改 .dark 中的变量定义**

```scss
.dark {
	--background: hsl(222.2 84% 4.9%);
	--foreground: hsl(210 40% 98%);
	--card: hsl(222.2 84% 4.9%);
	--card-foreground: hsl(210 40% 98%);
	--popover: hsl(222.2 84% 4.9%);
	--popover-foreground: hsl(210 40% 98%);
	--primary: hsl(210 40% 98%);
	--primary-foreground: hsl(222.2 47.4% 11.2%);
	--secondary: hsl(217.2 32.6% 17.5%);
	--secondary-foreground: hsl(210 40% 98%);
	--muted: hsl(217.2 32.6% 17.5%);
	--muted-foreground: hsl(215 20.2% 65.1%);
	--accent: hsl(217.2 32.6% 17.5%);
	--accent-foreground: hsl(210 40% 98%);
	--destructive: hsl(0 62.8% 30.6%);
	--destructive-foreground: hsl(210 40% 98%);
	--border: hsl(217.2 32.6% 17.5%);
	--input: hsl(217.2 32.6% 17.5%);
	--ring: hsl(212.7 26.8% 83.9%);
}
```

**Step 3: 修改 App.vue 内部的使用方**

将 App.vue 中所有 `hsl(var(--xxx))` 改为 `var(--xxx)`，共约 33 处。

带透明度的使用 `hsl(from var(--xxx) h s l / alpha)` 语法：

```scss
/* 修改前示例 */
background: hsl(var(--accent) / 0.5) !important;

/* 修改后 */
background: hsl(from var(--accent) h s l / 0.5) !important;
```

**Step 4: 验证修改**

Run: `pnpm build`
Expected: 构建成功，无 CSS 语法错误

**Step 5: Commit**

```bash
git add src/App.vue
git commit -m "refactor: update CSS variable definitions to use hsl() wrapper"
```

---

## Task 2: 修改 views/SectBuilderPage.vue

**Files:**
- Modify: `src/views/SectBuilderPage.vue`

**Step 1: 替换所有 hsl(var(--xxx)) 为 var(--xxx)**

约 5 处需要修改：
- `color: hsl(var(--foreground));` → `color: var(--foreground);`
- `color: hsl(var(--muted-foreground));` → `color: var(--muted-foreground);`
- `border: 1px dashed hsl(var(--border));` → `border: 1px dashed var(--border);`

**Step 2: 验证**

检查文件无 `hsl(var(--` 残留。

**Step 3: Commit**

```bash
git add src/views/SectBuilderPage.vue
git commit -m "refactor: update SectBuilderPage to use new CSS variable format"
```

---

## Task 3: 修改 views/SearchDoublePage.vue

**Files:**
- Modify: `src/views/SearchDoublePage.vue`

**Step 1: 检查并替换**

检查文件中是否有 `hsl(var(--xxx))` 使用，如有则替换为 `var(--xxx)`。

**Step 2: Commit（如有修改）**

```bash
git add src/views/SearchDoublePage.vue
git commit -m "refactor: update SearchDoublePage to use new CSS variable format"
```

---

## Task 4: 修改 components/Public/PageHeader.vue

**Files:**
- Modify: `src/components/Public/PageHeader.vue`

**Step 1: 替换所有 hsl(var(--xxx)) 为 var(--xxx)**

约 10 处需要修改，包括带透明度的：
- `background: hsl(var(--accent) / 0.5);` → `background: hsl(from var(--accent) h s l / 0.5);`

**Step 2: Commit**

```bash
git add src/components/Public/PageHeader.vue
git commit -m "refactor: update PageHeader to use new CSS variable format"
```

---

## Task 5: 修改 components/Public/SkillCard.vue

**Files:**
- Modify: `src/components/Public/SkillCard.vue`

**Step 1: 替换所有 hsl(var(--xxx)) 为 var(--xxx)**

约 13 处需要修改。

**Step 2: Commit**

```bash
git add src/components/Public/SkillCard.vue
git commit -m "refactor: update SkillCard to use new CSS variable format"
```

---

## Task 6: 修改 components/SectBuilderPage/SelectSkillCard.vue

**Files:**
- Modify: `src/components/SectBuilderPage/SelectSkillCard.vue`

**Step 1: 替换所有 hsl(var(--xxx)) 为 var(--xxx)**

约 8 处需要修改，包括带透明度的：
- `background: hsl(var(--accent) / 0.3);` → `background: hsl(from var(--accent) h s l / 0.3);`

**Step 2: Commit**

```bash
git add src/components/SectBuilderPage/SelectSkillCard.vue
git commit -m "refactor: update SelectSkillCard to use new CSS variable format"
```

---

## Task 7: 修改 components/SectBuilderPage/SelectableSkillCard.vue

**Files:**
- Modify: `src/components/SectBuilderPage/SelectableSkillCard.vue`

**Step 1: 替换所有 hsl(var(--xxx)) 为 var(--xxx)**

约 2 处需要修改。

**Step 2: Commit**

```bash
git add src/components/SectBuilderPage/SelectableSkillCard.vue
git commit -m "refactor: update SelectableSkillCard to use new CSS variable format"
```

---

## Task 8: 修改 components/SectBuilderPage/ChangeSkillSectForm.vue

**Files:**
- Modify: `src/components/SectBuilderPage/ChangeSkillSectForm.vue`

**Step 1: 替换所有 hsl(var(--xxx)) 为 var(--xxx)**

约 18 处需要修改，包括带透明度的：
- `border-color: hsl(var(--border) / 0.5);` → `border-color: hsl(from var(--border) h s l / 0.5);`
- `background: hsl(var(--secondary) / 0.5);` → `background: hsl(from var(--secondary) h s l / 0.5);`

**Step 2: Commit**

```bash
git add src/components/SectBuilderPage/ChangeSkillSectForm.vue
git commit -m "refactor: update ChangeSkillSectForm to use new CSS variable format"
```

---

## Task 9: 修改 components/SearchDoublePage/SearchDoubleEffectForm.vue

**Files:**
- Modify: `src/components/SearchDoublePage/SearchDoubleEffectForm.vue`

**Step 1: 替换所有 hsl(var(--xxx)) 为 var(--xxx)**

约 9 处需要修改。

**Step 2: Commit**

```bash
git add src/components/SearchDoublePage/SearchDoubleEffectForm.vue
git commit -m "refactor: update SearchDoubleEffectForm to use new CSS variable format"
```

---

## Task 10: 最终验证

**Step 1: 全局搜索验证**

Run: `search_file_content --pattern "hsl\(var\(" --path "src" --include "*.vue"`
Expected: 无匹配结果（确认所有使用方已更新）

**Step 2: 构建测试**

Run: `pnpm build`
Expected: 构建成功，无错误

**Step 3: 视觉回归测试**

Run: `pnpm dev`
Manual Check:
- 浅色模式：页面背景、文字、边框颜色正常
- 深色模式：切换后颜色正常
- 特殊元素：表格悬停效果、输入框聚焦效果正常

**Step 4: Commit 最终状态**

```bash
git add docs/plans/2026-03-05-hsl-css-variable-refactor-design.md
git add docs/plans/2026-03-05-hsl-css-variable-refactor-implementation.md
git commit -m "docs: add HSL CSS variable refactor design and implementation plans"
```

---

## 实施完成总结

所有文件修改完成后，CSS 变量的使用方式将从：
```css
/* 定义 */
--background: 0 0% 100%;

/* 使用 */
background: hsl(var(--background));
```

变为：
```css
/* 定义 */
--background: hsl(0 0% 100%);

/* 使用 */
background: var(--background);
```

带透明度的语法从：
```css
background: hsl(var(--accent) / 0.5);
```

变为：
```css
background: hsl(from var(--accent) h s l / 0.5);
```
