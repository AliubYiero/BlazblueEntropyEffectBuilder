# UI 主题重构设计文档

**日期**: 2026-03-03  
**目标**: 将现有赛博朋克风格 UI 重构为 shadcn 风格，并添加浅色/深色模式切换

---

## 需求概述

1. 移除渐变效果
2. 添加浅色模式（主题切换）
3. 采用 shadcn 风格：简洁、扁平、功能优先

### 用户决策

| 决策项 | 选择 |
|--------|------|
| 主题切换位置 | 导航栏右侧 |
| 元素颜色呈现 | 小圆点/标签背景色标识，文字保持中性 |
| 主题持久化 | localStorage |
| 技术方案 | CSS 变量重构 |

---

## 架构设计

### 主题系统架构

1. **CSS 变量层**：在 `App.vue` 定义两套 CSS 变量
   - `:root` 为浅色模式（默认）
   - `:root.dark` 为深色模式
   - 变量命名遵循 shadcn 风格：`--background`、`--foreground`、`--card`、`--border`、`--muted`、`--primary` 等

2. **主题切换逻辑**：
   - 创建 `composables/useTheme.ts` 组合式函数
   - 管理 `isDark` 状态，读取/写入 localStorage
   - 提供 `toggleTheme()` 方法，切换时在 `<html>` 元素添加/移除 `dark` 类

3. **无需引入新依赖**，利用现有的 Vue 3 Composition API

---

## 组件设计

### 涉及的组件变更

1. **`App.vue`**
   - 移除赛博朋克风格样式（渐变背景、网格、霓虹色等）
   - 定义 shadcn 风格的 CSS 变量（浅色/深色两套）
   - 简化为扁平设计，无渐变

2. **`PageHeader.vue`**
   - 简化导航栏样式：白色/浅灰背景，清晰的边框
   - 添加主题切换按钮（Sun/Moon 图标）
   - 移除装饰性元素（装饰线、光点等）

3. **`SearchDoubleEffectForm.vue`**
   - 卡片改为简洁边框样式
   - 元素颜色仅用小圆点标识
   - 文字使用中性灰度色

4. **`SectBuilderPage.vue` & 子组件**
   - 技能卡片简化为方角或微圆角
   - 移除背景网格和装饰线条
   - 槽位标识用简单的标签代替

5. **新建 `composables/useTheme.ts`**
   - 主题状态管理逻辑

---

## 数据流设计

### 主题切换的数据流

1. **初始化流程**：
   ```
   应用启动 → useTheme.ts 读取 localStorage
   → 若有保存值则应用，否则使用系统偏好 (prefers-color-scheme)
   → 在 <html> 元素设置/移除 dark 类
   ```

2. **切换流程**：
   ```
   用户点击切换按钮 → toggleTheme()
   → isDark 取反 → 写入 localStorage
   → <html> 元素添加/移除 dark 类
   → CSS 变量自动切换（浏览器重绘）
   ```

3. **数据结构**：
   ```typescript
   // useTheme.ts
   const isDark = ref<boolean>(false)
   const THEME_KEY = 'theme-preference'
   
   // localStorage 存储值: 'light' | 'dark'
   ```

---

## 错误处理设计

### 主题系统的错误处理

1. **localStorage 异常**：
   - 用 `try-catch` 包裹 localStorage 读写操作
   - 若 localStorage 不可用（隐私模式/禁用），降级为仅当前会话有效
   - 不阻塞应用运行

2. **SSR/预渲染兼容**：
   - 在访问 `window` 或 `localStorage` 前检查环境
   - 使用 `typeof window !== 'undefined'` 判断

3. **代码示例**：
   ```typescript
   const getStoredTheme = (): 'light' | 'dark' | null => {
     try {
       return localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null
     } catch {
       return null
     }
   }
   ```

---

## 测试设计

### 主题系统的测试策略

1. **手动测试清单**：
   - 点击切换按钮，验证浅色/深色模式切换
   - 刷新页面，验证主题持久化
   - 清除 localStorage，验证默认主题（跟随系统）
   - 在不同浏览器测试 localStorage 兼容性

2. **视觉回归测试**：
   - 使用 frontend-tester 验证两个页面的浅色/深色模式
   - 确认元素颜色标识（小圆点）在两种模式下都清晰可见

3. **无需单元测试**：
   - 主题系统逻辑简单，localStorage 操作是浏览器原生 API
   - 符合 YAGNI 原则，避免过度测试

---

## 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/composables/useTheme.ts` | 新建 | 主题状态管理 |
| `src/App.vue` | 修改 | 重构 CSS 变量，移除渐变 |
| `src/components/Public/PageHeader.vue` | 修改 | 简化样式，添加主题切换按钮 |
| `src/components/SearchDoublePage/SearchDoubleEffectForm.vue` | 修改 | shadcn 风格重构 |
| `src/views/SectBuilderPage.vue` | 修改 | shadcn 风格重构 |
| `src/components/SectBuilderPage/SkillCard.vue` | 修改 | 简化卡片样式 |
| `src/components/SectBuilderPage/SelectableSkillCard.vue` | 修改 | 简化列表样式 |
| `src/components/SectBuilderPage/ChangeSkillSectForm.vue` | 修改 | 简化对话框样式 |

---

## CSS 变量定义（shadcn 风格）

```css
/* 浅色模式 */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

/* 深色模式 */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}

/* 元素颜色标识（两种模式共用） */
:root {
  --element-fire: 0 84% 60%;
  --element-ice: 199 89% 48%;
  --element-thunder: 48 96% 53%;
  --element-poison: 271 91% 65%;
  --element-dark: 258 90% 66%;
  --element-light: 45 93% 47%;
  --element-blade: 215 16% 47%;
}
```
