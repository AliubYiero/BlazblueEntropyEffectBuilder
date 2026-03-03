# UI 主题重构实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将赛博朋克风格 UI 重构为 shadcn 风格，并添加浅色/深色模式切换功能

**Architecture:** 使用 CSS 变量定义两套主题（浅色/深色），通过 Vue Composition API 管理主题状态，localStorage 持久化用户偏好

**Tech Stack:** Vue 3 Composition API, SCSS, CSS Variables, localStorage

---

## Task 1: 创建主题管理 Composable

**Files:**
- Create: `src/composables/useTheme.ts`

**Step 1: 创建 composables 目录和 useTheme.ts**

```typescript
// src/composables/useTheme.ts
import { ref, watch, onMounted } from 'vue';

const THEME_KEY = 'theme-preference';
const isDark = ref<boolean>(false);

/**
 * 获取存储的主题偏好
 */
const getStoredTheme = (): 'light' | 'dark' | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
  } catch {
    return null;
  }
};

/**
 * 存储主题偏好
 */
const setStoredTheme = (theme: 'light' | 'dark'): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // localStorage 不可用时静默失败
  }
};

/**
 * 获取系统主题偏好
 */
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * 应用主题到 DOM
 */
const applyTheme = (dark: boolean): void => {
  if (typeof document === 'undefined') return;
  
  const html = document.documentElement;
  if (dark) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
};

/**
 * 切换主题
 */
const toggleTheme = (): void => {
  isDark.value = !isDark.value;
};

/**
 * 初始化主题
 */
const initTheme = (): void => {
  const stored = getStoredTheme();
  if (stored) {
    isDark.value = stored === 'dark';
  } else {
    isDark.value = getSystemTheme() === 'dark';
  }
};

// 监听主题变化
watch(isDark, (value) => {
  applyTheme(value);
  setStoredTheme(value ? 'dark' : 'light');
});

export function useTheme() {
  onMounted(() => {
    initTheme();
    applyTheme(isDark.value);
  });

  return {
    isDark,
    toggleTheme,
  };
}
```

**Step 2: 验证文件创建成功**

Run: `ls src/composables/`
Expected: `useTheme.ts` 文件存在

**Step 3: Commit**

```bash
git add src/composables/useTheme.ts
git commit -m "feat: add useTheme composable for theme management"
```

---

## Task 2: 重构 App.vue CSS 变量为 shadcn 风格

**Files:**
- Modify: `src/App.vue`

**Step 1: 替换 CSS 变量为 shadcn 风格**

将 `:root` 中的 CSS 变量替换为以下内容：

```scss
<style lang="scss">
/* ============================================
   BLAZBLUE ENTROPY EFFECT BUILDER
   shadcn 风格 UI
   ============================================ */

/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap');

/* CSS 变量 - shadcn 风格 */
:root {
  /* 基础颜色 (HSL 格式) */
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
  
  /* 元素颜色 - 用于小圆点标识 */
  --element-fire: 0 84% 60%;
  --element-ice: 199 89% 48%;
  --element-thunder: 48 96% 53%;
  --element-poison: 271 91% 65%;
  --element-dark: 258 90% 66%;
  --element-light: 45 93% 47%;
  --element-blade: 215 16% 47%;
  
  /* 字体 */
  --font-sans: 'Inter', 'Noto Sans SC', system-ui, sans-serif;
  --font-chinese: 'Noto Sans SC', sans-serif;
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

/* 辅助函数：HSL 转换 */
@function hsl($var) {
  @return hsl(var(--#{$var}));
}

@function hsl-a($var, $alpha) {
  @return hsl(var(--#{$var}) / #{$alpha});
}

/* 全局重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: hsl(background);
}

::-webkit-scrollbar-thumb {
  background: hsl(border);
  border-radius: 4px;
  
  &:hover {
    background: hsl(muted-foreground);
  }
}

/* 选择文本 */
::selection {
  background: hsl(primary);
  color: hsl(primary-foreground);
}

/* Body 样式 */
body {
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.5;
  color: hsl(foreground);
  background-color: hsl(background);
}

/* 应用容器 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 主内容区 */
.main-content {
  flex: 1;
}

/* ===== Element Plus 覆盖 ===== */

.el-menu {
  background: transparent !important;
  border: none !important;
}

.el-menu-item {
  font-family: var(--font-chinese) !important;
  
  &:hover {
    background: hsl-a(accent, 0.5) !important;
  }
  
  &.is-active {
    border-bottom: 2px solid hsl(primary) !important;
    color: hsl(primary) !important;
  }
}

.el-table {
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: hsl-a(muted, 0.5);
  --el-table-row-hover-bg-color: hsl-a(muted, 0.5);
  --el-table-border-color: hsl(border);
  --el-table-text-color: hsl(foreground);
  --el-table-header-text-color: hsl(foreground);
  
  font-family: var(--font-chinese) !important;
  
  .el-table__header th {
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
  }
}

.el-input__wrapper,
.el-autocomplete .el-input__wrapper,
.el-select .el-input__wrapper {
  background: hsl(background) !important;
  border: 1px solid hsl(border) !important;
  border-radius: calc(var(--radius) - 2px) !important;
  box-shadow: none !important;
  
  &:hover {
    border-color: hsl(ring) !important;
  }
  
  &.is-focus,
  &:focus-within {
    border-color: hsl(ring) !important;
    box-shadow: 0 0 0 1px hsl(ring) !important;
  }
}

.el-input__inner {
  color: hsl(foreground) !important;
  font-family: var(--font-chinese) !important;
  
  &::placeholder {
    color: hsl(muted-foreground) !important;
  }
}

.el-checkbox {
  font-family: var(--font-chinese) !important;
  
  .el-checkbox__label {
    color: hsl(foreground) !important;
  }
  
  .el-checkbox__inner {
    background: hsl(background) !important;
    border-color: hsl(border) !important;
    border-radius: calc(var(--radius) - 4px) !important;
  }
  
  &.is-checked .el-checkbox__inner {
    background: hsl(primary) !important;
    border-color: hsl(primary) !important;
  }
}

.el-button {
  font-family: var(--font-chinese) !important;
  border-radius: calc(var(--radius) - 2px) !important;
  
  &--primary {
    background: hsl(primary) !important;
    border-color: hsl(primary) !important;
    color: hsl(primary-foreground) !important;
    
    &:hover {
      background: hsl(primary) !important;
      opacity: 0.9;
    }
  }
}

.el-dialog {
  background: hsl(card) !important;
  border: 1px solid hsl(border) !important;
  border-radius: var(--radius) !important;
  
  .el-dialog__header {
    border-bottom: 1px solid hsl(border) !important;
    padding: 16px 20px !important;
  }
  
  .el-dialog__title {
    font-family: var(--font-chinese) !important;
    font-weight: 600;
    color: hsl(foreground) !important;
  }
  
  .el-dialog__body {
    padding: 20px !important;
  }
}

.el-divider {
  border-color: hsl(border) !important;
}

.el-select-dropdown {
  background: hsl(popover) !important;
  border: 1px solid hsl(border) !important;
  border-radius: calc(var(--radius) - 2px) !important;
  
  .el-select-dropdown__item {
    font-family: var(--font-chinese) !important;
    color: hsl(foreground) !important;
    
    &:hover {
      background: hsl-a(accent, 0.5) !important;
    }
    
    &.is-selected {
      color: hsl(primary) !important;
    }
  }
}

.el-form-item__label {
  font-family: var(--font-chinese) !important;
  color: hsl(foreground) !important;
}

/* ===== 元素颜色工具类 ===== */
.element-fire { color: hsl(var(--element-fire)); }
.element-ice { color: hsl(var(--element-ice)); }
.element-thunder { color: hsl(var(--element-thunder)); }
.element-poison { color: hsl(var(--element-poison)); }
.element-dark { color: hsl(var(--element-dark)); }
.element-light { color: hsl(var(--element-light)); }
.element-blade { color: hsl(var(--element-blade)); }

/* 元素圆点 */
.element-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  
  &--fire { background: hsl(var(--element-fire)); }
  &--ice { background: hsl(var(--element-ice)); }
  &--thunder { background: hsl(var(--element-thunder)); }
  &--poison { background: hsl(var(--element-poison)); }
  &--dark { background: hsl(var(--element-dark)); }
  &--light { background: hsl(var(--element-light)); }
  &--blade { background: hsl(var(--element-blade)); }
}
</style>

<template>
	<div class="app-container">
		<page-header/>
		<main class="main-content">
			<router-view/>
		</main>
	</div>
</template>

<script lang="ts" setup>
import PageHeader from './components/Public/PageHeader.vue';
</script>
```

**Step 2: 验证编译成功**

Run: `pnpm build`
Expected: 构建成功，无错误

**Step 3: Commit**

```bash
git add src/App.vue
git commit -m "refactor: convert CSS variables to shadcn style with light/dark mode support"
```

---

## Task 3: 重构 PageHeader.vue 添加主题切换按钮

**Files:**
- Modify: `src/components/Public/PageHeader.vue`

**Step 1: 重写 PageHeader.vue 为 shadcn 风格**

```vue
<style lang="scss" scoped>
/* ============================================
   导航栏 - shadcn 风格
   ============================================ */

.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: hsl(var(--background));
  border-bottom: 1px solid hsl(var(--border));
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-text {
  font-family: var(--font-chinese);
  font-size: 16px;
  font-weight: 600;
  color: hsl(var(--foreground));
}

.logo-subtitle {
  font-family: var(--font-chinese);
  font-size: 12px;
  color: hsl(var(--muted-foreground));
}

/* 导航 */
.nav-menu {
  display: flex;
  gap: 4px;
}

.nav-item {
  padding: 8px 16px;
  font-family: var(--font-chinese);
  font-size: 14px;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  background: transparent;
  border: none;
  border-radius: calc(var(--radius) - 4px);
  cursor: pointer;
  transition: all 0.15s ease;
  
  &:hover {
    color: hsl(var(--foreground));
    background: hsl-a(accent, 0.5);
  }
  
  &.is-active {
    color: hsl(var(--foreground));
    background: hsl-a(accent, 1);
  }
}

/* 右侧操作区 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 主题切换按钮 */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius) - 4px);
  cursor: pointer;
  transition: all 0.15s ease;
  
  &:hover {
    background: hsl-a(accent, 0.5);
    border-color: hsl(var(--ring));
  }
  
  svg {
    width: 18px;
    height: 18px;
    color: hsl(var(--foreground));
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .header-inner {
    padding: 0 16px;
  }
  
  .logo-subtitle {
    display: none;
  }
  
  .nav-item {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>

<template>
  <header class="header">
    <div class="header-inner">
      <!-- Logo -->
      <div class="logo-section">
        <span class="logo-text">苍翼混沌效应</span>
        <span class="logo-subtitle">流派构建器</span>
      </div>
      
      <!-- 导航 -->
      <nav class="nav-menu">
        <button
          v-for="item in navItems"
          :key="item.path"
          :class="['nav-item', { 'is-active': currentPath === item.path }]"
          @click="handleNavigate(item.path)"
        >
          {{ item.label }}
        </button>
      </nav>
      
      <!-- 右侧操作 -->
      <div class="header-actions">
        <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换到浅色模式' : '切换到深色模式'">
          <!-- 太阳图标 (深色模式显示) -->
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <!-- 月亮图标 (浅色模式显示) -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { router } from '../../router';
import { useTheme } from '../../composables/useTheme';

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: '双重词条', path: '/' },
  { label: '流派构建', path: '/builder' },
];

const currentPath = computed(() => router.currentRoute.value.path);
const { isDark, toggleTheme } = useTheme();

const handleNavigate = (path: string) => {
  router.push(path);
};
</script>
```

**Step 2: 验证编译成功**

Run: `pnpm build`
Expected: 构建成功，无错误

**Step 3: Commit**

```bash
git add src/components/Public/PageHeader.vue
git commit -m "refactor: redesign PageHeader to shadcn style with theme toggle"
```

---

## Task 4: 重构 SearchDoubleEffectForm.vue

**Files:**
- Modify: `src/components/SearchDoublePage/SearchDoubleEffectForm.vue`

**Step 1: 重写为 shadcn 风格**

```vue
<style lang="scss" scoped>
/* ============================================
   双重词条筛选页 - shadcn 风格
   ============================================ */

.page-container {
  min-height: calc(100vh - 60px);
  padding: 24px;
  max-width: 1280px;
  margin: 0 auto;
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 32px;
}

.filter-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  padding: 24px;
}

.filter-title {
  font-family: var(--font-chinese);
  font-size: 14px;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin-bottom: 16px;
}

/* 输入行 */
.input-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.input-group {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-family: var(--font-chinese);
  font-size: 12px;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
}

/* 复选框区域 */
.checkbox-section {
  padding-top: 16px;
  border-top: 1px solid hsl(var(--border));
}

.checkbox-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  
  &:not(:last-child) {
    margin-bottom: 8px;
  }
}

.checkbox-label {
  font-family: var(--font-chinese);
  font-size: 12px;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  min-width: 40px;
}

/* 结果统计 */
.results-header {
  margin-bottom: 16px;
}

.results-count {
  font-family: var(--font-chinese);
  font-size: 14px;
  color: hsl(var(--muted-foreground));
  
  .count-number {
    font-weight: 600;
    color: hsl(var(--foreground));
  }
}

/* 技能卡片网格 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

/* 技能卡片 */
.skill-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  padding: 16px;
  transition: all 0.15s ease;
  
  &:hover {
    border-color: hsl(var(--ring));
    background: hsl-a(accent, 0.3);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.skill-name {
  font-family: var(--font-chinese);
  font-size: 14px;
  font-weight: 600;
  color: hsl(var(--foreground));
}

.trigger-badges {
  display: flex;
  gap: 4px;
}

.trigger-badge {
  font-family: var(--font-chinese);
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: calc(var(--radius) - 4px);
  background: hsl-a(secondary, 1);
  color: hsl(var(--secondary-foreground));
}

/* 流派组合 */
.sect-combo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.sect-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.sect-name {
  font-family: var(--font-chinese);
  font-size: 13px;
  font-weight: 500;
  color: hsl(var(--foreground));
}

.sect-connector {
  color: hsl(var(--muted-foreground));
  font-size: 12px;
}

/* 描述 */
.skill-description {
  font-family: var(--font-chinese);
  font-size: 13px;
  line-height: 1.5;
  color: hsl(var(--muted-foreground));
  padding-top: 8px;
  border-top: 1px solid hsl(var(--border));
}

/* 空状态 */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 48px;
  color: hsl(var(--muted-foreground));
}

/* 响应式 */
@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }
  
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div class="page-container">
    <!-- 筛选区域 -->
    <section class="filter-section">
      <div class="filter-card">
        <div class="filter-title">筛选条件</div>
        
        <!-- 输入框 -->
        <div class="input-row">
          <div class="input-group">
            <label class="input-label">属性</label>
            <el-autocomplete
              v-model="attribute"
              :fetch-suggestions="handleFetchAttributeSuggestions"
              placeholder="选择或输入属性"
              clearable
            />
          </div>
          
          <div class="input-group">
            <label class="input-label">流派</label>
            <el-autocomplete
              v-model="sect"
              :fetch-suggestions="handleFetchSectSuggestions"
              placeholder="选择或输入流派"
              clearable
            />
          </div>
        </div>
        
        <!-- 复选框 -->
        <div class="checkbox-section">
          <div class="checkbox-row">
            <span class="checkbox-label">流派</span>
            <el-checkbox v-for="item in sectCheckboxes" :key="item.key" v-model="item.value" :label="item.label" />
          </div>
          
          <div class="checkbox-row">
            <span class="checkbox-label">槽位</span>
            <el-checkbox v-for="item in triggerCheckboxes" :key="item.key" v-model="item.value" :label="item.label" />
          </div>
        </div>
      </div>
    </section>
    
    <!-- 结果统计 -->
    <div class="results-header">
      <div class="results-count">
        <span class="count-number">{{ filterSkillInfoList.length }}</span> 条双重策略
      </div>
    </div>
    
    <!-- 技能卡片网格 -->
    <div class="skills-grid">
      <div v-if="filterSkillInfoList.length === 0" class="empty-state">
        没有找到匹配的双重策略
      </div>
      
      <div 
        v-for="skill in filterSkillInfoList"
        :key="skill.name"
        class="skill-card"
      >
        <div class="card-header">
          <h3 class="skill-name">{{ skill.name }}</h3>
          <div class="trigger-badges">
            <span v-for="trigger in skill.trigger" :key="trigger" class="trigger-badge">{{ trigger }}</span>
          </div>
        </div>
        
        <div class="sect-combo">
          <div class="sect-item">
            <span :class="['element-dot', `element-dot--${styleMapper[skill.mainAttribute]}`]"></span>
            <span class="sect-name">{{ skill.mainSect }}</span>
          </div>
          
          <span class="sect-connector">+</span>
          
          <div class="sect-item">
            <span :class="['element-dot', `element-dot--${styleMapper[skill.secondAttribute]}`]"></span>
            <span class="sect-name">{{ skill.secondSect }}</span>
          </div>
        </div>
        
        <p class="skill-description">{{ skill.description }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSkillInfoStore } from '../../store/useSkillInfoStore.ts';
import { Attribute } from '../../interfaces/Attribute.ts';
import { computed, ref, reactive } from 'vue';
import { Sect } from '../../interfaces/Sect.ts';
import { sectConfig } from '../../config/sectConfig.ts';
import { Trigger } from '../../interfaces/Trigger.ts';

const skillInfoStore = useSkillInfoStore();

const attribute = ref<Attribute | ''>('');
const sect = ref<Sect[keyof Sect] | ''>('');

const sectCheckboxes = reactive([
  { key: 'main', label: '主流派', value: true },
  { key: 'second', label: '副流派', value: true },
]);

const triggerCheckboxes = reactive([
  { key: 'attack', label: '普攻', value: true },
  { key: 'skill', label: '技能', value: true },
  { key: 'sprint', label: '冲刺', value: true },
  { key: 'call', label: '召唤', value: true },
  { key: 'inherit', label: '传承', value: true },
]);

const handleFetchAttributeSuggestions = (searchString: string, cb: Function) => {
  const attributeSet: Set<Attribute> = new Set();
  skillInfoStore.skillInfoList.forEach(item => attributeSet.add(item.mainAttribute));
  const list = Array.from(attributeSet).map(item => ({ value: item }));
  cb(searchString ? list.filter(item => item.value.includes(searchString)) : list);
};

const handleFetchSectSuggestions = (searchString: string, cb: Function) => {
  const sectSet: Set<Sect[keyof Sect]> = new Set();
  skillInfoStore.skillInfoList.forEach(item => sectSet.add(item.mainSect));
  let list = Array.from(sectSet).map(item => ({ value: item }));
  
  if (attribute.value.trim()) {
    list = sectConfig[<Attribute>attribute.value.trim()].map(item => ({ value: item }));
  }
  
  cb(searchString ? list.filter(item => item.value.includes(searchString)) : list);
};

const filterSkillInfoList = computed(() => {
  return skillInfoStore.skillInfoList.filter(skillInfo => {
    const isMain = sectCheckboxes[0].value
      && skillInfo.mainAttribute.includes(attribute.value)
      && skillInfo.mainSect.includes(sect.value);
    
    const isSecond = sectCheckboxes[1].value
      && skillInfo.secondAttribute.includes(attribute.value)
      && skillInfo.secondSect.includes(sect.value);
    
    const uncheckedTriggers: Trigger[] = [
      triggerCheckboxes[0].value || '普攻',
      triggerCheckboxes[1].value || '技能',
      triggerCheckboxes[2].value || '冲刺',
      triggerCheckboxes[3].value || '召唤',
      triggerCheckboxes[4].value || '传承',
    ].filter(item => item !== true) as Trigger[];
    
    const isTrigger = skillInfo.trigger.every(t => uncheckedTriggers.includes(t));
    
    return (isMain || isSecond) && !isTrigger;
  });
});

const styleMapper: Record<Attribute, string> = {
  '火': 'fire', '冰': 'ice', '电': 'thunder',
  '毒': 'poison', '暗': 'dark', '光': 'light', '刃': 'blade',
};
</script>
```

**Step 2: 验证编译成功**

Run: `pnpm build`
Expected: 构建成功，无错误

**Step 3: Commit**

```bash
git add src/components/SearchDoublePage/SearchDoubleEffectForm.vue
git commit -m "refactor: redesign SearchDoubleEffectForm to shadcn style"
```

---

## Task 5: 重构 SectBuilderPage.vue 及子组件

**Files:**
- Modify: `src/views/SectBuilderPage.vue`
- Modify: `src/components/SectBuilderPage/SkillCard.vue`
- Modify: `src/components/SectBuilderPage/SelectableSkillCard.vue`
- Modify: `src/components/SectBuilderPage/ChangeSkillSectForm.vue`

**Step 1: 重写 SectBuilderPage.vue**

```vue
<style lang="scss" scoped>
/* ============================================
   流派构建页 - shadcn 风格
   ============================================ */

.page-container {
  min-height: calc(100vh - 60px);
  padding: 24px;
  max-width: 1280px;
  margin: 0 auto;
}

/* 区域标题 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-family: var(--font-chinese);
  font-size: 14px;
  font-weight: 600;
  color: hsl(var(--foreground));
}

.section-count {
  font-family: var(--font-chinese);
  font-size: 12px;
  color: hsl(var(--muted-foreground));
}

/* 已激活策略区域 */
.activated-section {
  margin-bottom: 32px;
}

.activated-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.activated-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  padding: 12px;
}

.activated-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.activated-name {
  font-family: var(--font-chinese);
  font-size: 13px;
  font-weight: 600;
  color: hsl(var(--foreground));
}

.activated-triggers {
  display: flex;
  gap: 4px;
}

.activated-trigger-tag {
  font-family: var(--font-chinese);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: calc(var(--radius) - 4px);
  background: hsl-a(secondary, 1);
  color: hsl(var(--secondary-foreground));
}

.activated-sects {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 6px;
}

.activated-sect {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-chinese);
  font-size: 12px;
  color: hsl(var(--foreground));
}

.activated-connector {
  color: hsl(var(--muted-foreground));
  font-size: 10px;
}

.activated-desc {
  font-family: var(--font-chinese);
  font-size: 12px;
  color: hsl(var(--muted-foreground));
}

/* 继承筛选 */
.inherit-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

/* 空状态 */
.empty-activated {
  grid-column: 1 / -1;
  text-align: center;
  padding: 32px;
  border: 1px dashed hsl(var(--border));
  border-radius: var(--radius);
  color: hsl(var(--muted-foreground));
}

/* 构建区域 */
.builder-section {
  margin-top: 24px;
}

.builder-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.slot-row {
  display: flex;
  gap: 16px;
  align-items: stretch;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }
  
  .slot-row {
    flex-direction: column;
  }
}
</style>

<template>
  <div class="page-container">
    <!-- 已激活的双重策略 -->
    <section class="activated-section">
      <div class="section-header">
        <h2 class="section-title">已激活策略</h2>
        <span class="section-count">共 {{ activatedSkills.length }} 条</span>
      </div>
      
      <div class="inherit-filters">
        <el-checkbox 
          v-for="trigger in triggerList" 
          :key="trigger"
          :model-value="isInheritChecked(trigger)"
          @change="(val: boolean) => toggleInherit(trigger, val)"
          :label="trigger"
        />
      </div>
      
      <div class="activated-grid">
        <div v-if="activatedSkills.length === 0" class="empty-activated">
          选择流派以激活双重策略
        </div>
        
        <div v-for="skill in activatedSkills" :key="skill.name" class="activated-card">
          <div class="activated-card-header">
            <span class="activated-name">{{ skill.name }}</span>
            <div class="activated-triggers">
              <span v-for="trigger in skill.trigger" :key="trigger" class="activated-trigger-tag">{{ trigger }}</span>
            </div>
          </div>
          <div class="activated-sects">
            <span class="activated-sect">
              <span :class="['element-dot', `element-dot--${styleMapper[skill.mainAttribute]}`]"></span>
              {{ skill.mainSect }}
            </span>
            <span class="activated-connector">+</span>
            <span class="activated-sect">
              <span :class="['element-dot', `element-dot--${styleMapper[skill.secondAttribute]}`]"></span>
              {{ skill.secondSect }}
            </span>
          </div>
          <p class="activated-desc">{{ skill.description }}</p>
        </div>
      </div>
    </section>
    
    <!-- 技能槽位构建 -->
    <section class="builder-section">
      <div class="section-header">
        <h2 class="section-title">流派配置</h2>
      </div>
      
      <div class="builder-grid">
        <div v-for="skillCard in skillCardInfoList" :key="skillCard.triggerName" class="slot-row">
          <skill-card :skillCardInfo="skillCard" @open-dialog="openDialog"/>
          <selectable-skill-card :skillCardInfo="skillCard"/>
        </div>
      </div>
    </section>
    
    <el-dialog v-model="isShowDialog" title="修改技能流派" width="400px">
      <change-skill-sect-form :trigger-name="currentTrigger" @close-dialog="closeDialog"/>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import SkillCard from '../components/SectBuilderPage/SkillCard.vue';
import SelectableSkillCard from '../components/SectBuilderPage/SelectableSkillCard.vue';
import ChangeSkillSectForm from '../components/SectBuilderPage/ChangeSkillSectForm.vue';
import { useSkillCardInfoStore } from '../store/useSkillCardInfoStore.ts';
import { useSkillInfoStore } from '../store/useSkillInfoStore.ts';
import { SkillCardInfoTuple } from '../interfaces/SkillCardInfoTuple.ts';
import { SkillInfoInterface } from '../interfaces/SkillInfoInterface.ts';
import { Trigger } from '../interfaces/Trigger.ts';
import { Attribute } from '../interfaces/Attribute.ts';

const skillCardInfoStore = useSkillCardInfoStore();
const skillInfoStore = useSkillInfoStore();

const skillCardInfoList = computed<SkillCardInfoTuple>(() => skillCardInfoStore.skillCardInfoList);
const triggerList: Trigger[] = ['普攻', '技能', '冲刺', '传承', '召唤'];

const isInheritChecked = (trigger: Trigger) => {
  const card = skillCardInfoStore.skillCardInfoList.find(c => c.triggerName === trigger);
  return card?.inherit || false;
};

const toggleInherit = (trigger: Trigger, value: boolean) => {
  skillCardInfoStore.updateSkillCardInfoInherit(trigger, value);
};

const activatedSkills = computed<SkillInfoInterface[]>(() => {
  const sectList = skillCardInfoStore.skillCardInfoList
    .filter(card => card.sect)
    .map(card => card.sect);
  return skillInfoStore.skillInfoList.filter(skill =>
    sectList.includes(skill.mainSect) && sectList.includes(skill.secondSect)
  );
});

const styleMapper: Record<Attribute, string> = {
  '火': 'fire', '冰': 'ice', '电': 'thunder',
  '毒': 'poison', '暗': 'dark', '光': 'light', '刃': 'blade',
};

const isShowDialog = ref(false);
const currentTrigger = ref<Trigger>('普攻');

const openDialog = (trigger: Trigger) => {
  currentTrigger.value = trigger;
  isShowDialog.value = true;
};

const closeDialog = () => {
  isShowDialog.value = false;
};
</script>
```

**Step 2: 重写 SkillCard.vue**

```vue
<style lang="scss" scoped>
.skill-card {
  flex-shrink: 0;
  width: 120px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  
  &:hover {
    border-color: hsl(var(--ring));
    background: hsl-a(accent, 0.3);
  }
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: hsl-a(secondary, 1);
  border: 2px solid hsl(var(--border));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  
  .icon-inner {
    width: 16px;
    height: 16px;
    background: hsl(var(--muted-foreground));
    border-radius: 50%;
  }
}

.card-trigger {
  font-family: var(--font-chinese);
  font-size: 12px;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  margin-bottom: 4px;
}

.card-sect {
  font-family: var(--font-chinese);
  font-size: 13px;
  font-weight: 500;
  color: hsl(var(--foreground));
  
  &--empty {
    color: hsl(var(--muted-foreground));
    font-weight: 400;
  }
}

@media (max-width: 768px) {
  .skill-card {
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
    
    .card-icon {
      margin-bottom: 0;
    }
  }
}
</style>

<template>
  <div class="skill-card" @click="handleClick">
    <div class="card-icon">
      <div class="icon-inner"></div>
    </div>
    <div>
      <span class="card-trigger">{{ skillCardInfo.triggerName }}</span>
      <br>
      <span :class="['card-sect', { 'card-sect--empty': !skillCardInfo.sect }]">
        {{ skillCardInfo.sect || '点击选择' }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SkillCardInfo } from '../../interfaces/SkillCardInfo.ts';
import { Trigger } from '../../interfaces/Trigger.ts';

const props = defineProps<{ skillCardInfo: SkillCardInfo }>();
const emit = defineEmits<{ (event: 'openDialog', value: Trigger): void }>();

const handleClick = () => emit('openDialog', props.skillCardInfo.triggerName);
</script>
```

**Step 3: 重写 SelectableSkillCard.vue**

```vue
<style lang="scss" scoped>
.selectable-container {
  flex: 1;
  min-width: 0;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  border: 1px dashed hsl(var(--border));
  border-radius: var(--radius);
  color: hsl(var(--muted-foreground));
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 8px;
}

.skill-item {
  background: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius) - 2px);
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  
  &:hover {
    border-color: hsl(var(--ring));
    background: hsl-a(accent, 0.3);
  }
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.skill-name {
  font-family: var(--font-chinese);
  font-size: 13px;
  font-weight: 500;
  color: hsl(var(--foreground));
}

.sect-combo {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.sect-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-chinese);
  font-size: 11px;
  color: hsl(var(--foreground));
}

.sect-connector {
  color: hsl(var(--muted-foreground));
  font-size: 10px;
}

.skill-desc {
  font-family: var(--font-chinese);
  font-size: 11px;
  color: hsl(var(--muted-foreground));
}
</style>

<template>
  <div class="selectable-container">
    <div v-if="filterDetailList.length === 0" class="empty-state">
      选择流派后显示可组合的双重策略
    </div>
    
    <div v-else class="skills-grid">
      <div v-for="detail in filterDetailList" :key="detail.name" class="skill-item">
        <div class="item-header">
          <span class="skill-name">{{ detail.name }}</span>
        </div>
        <div class="sect-combo">
          <span class="sect-tag">
            <span :class="['element-dot', `element-dot--${styleMapper[detail.mainAttribute]}`]"></span>
            {{ detail.mainSect }}
          </span>
          <span class="sect-connector">+</span>
          <span class="sect-tag">
            <span :class="['element-dot', `element-dot--${styleMapper[detail.secondAttribute]}`]"></span>
            {{ detail.secondSect }}
          </span>
        </div>
        <p class="skill-desc">{{ detail.description }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { SkillCardInfo } from '../../interfaces/SkillCardInfo.ts';
import { useSkillInfoStore } from '../../store/useSkillInfoStore.ts';
import { useSkillCardInfoStore } from '../../store/useSkillCardInfoStore.ts';
import { SkillInfoInterface } from '../../interfaces/SkillInfoInterface.ts';
import { Attribute } from '../../interfaces/Attribute.ts';

const props = defineProps<{ skillCardInfo: SkillCardInfo }>();
const skillInfoStore = useSkillInfoStore();
const skillCardInfoStore = useSkillCardInfoStore();

const filterDetailList = computed<SkillInfoInterface[]>(() => {
  let list = skillInfoStore.skillInfoList.filter(skill =>
    props.skillCardInfo.sect && (skill.mainSect.includes(props.skillCardInfo.sect) || skill.secondSect.includes(props.skillCardInfo.sect))
  );
  const existing = skillCardInfoStore.skillCardInfoList.filter(c => c.sect || c.inherit).map(c => c.triggerName);
  return list.filter(skill => skill.trigger.some(t => !existing.includes(t)));
});

const highlightAttribute = (skill: SkillInfoInterface): Attribute =>
  skill.mainSect === props.skillCardInfo.sect ? skill.secondAttribute : skill.mainAttribute;

const styleMapper: Record<Attribute, string> = {
  '火': 'fire', '冰': 'ice', '电': 'thunder',
  '毒': 'poison', '暗': 'dark', '光': 'light', '刃': 'blade',
};
</script>
```

**Step 4: 重写 ChangeSkillSectForm.vue**

```vue
<style lang="scss" scoped>
.form-container {
  padding: 8px 0;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  font-family: var(--font-chinese);
  font-size: 12px;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  margin-bottom: 8px;
  display: block;
}

.trigger-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: hsl-a(secondary, 1);
  border-radius: calc(var(--radius) - 2px);
}

.trigger-badge {
  font-family: var(--font-chinese);
  font-size: 13px;
  font-weight: 500;
  color: hsl(var(--secondary-foreground));
}

.input-row {
  display: flex;
  gap: 8px;
}

.input-main {
  flex: 1;
}

.input-side {
  width: 100px;
}

.sect-options {
  margin-top: 12px;
  max-height: 180px;
  overflow-y: auto;
}

.sect-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius) - 2px);
  margin-bottom: 4px;
  cursor: pointer;
  
  &:hover {
    background: hsl-a(accent, 0.3);
  }
  
  &.is-selected {
    border-color: hsl(var(--ring));
  }
}

.sect-name {
  font-family: var(--font-chinese);
  font-size: 12px;
  color: hsl(var(--foreground));
}

.button-group {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid hsl(var(--border));
}
</style>

<template>
  <div class="form-container">
    <el-form ref="formRef" :model="formData" :rules="rules">
      <div class="form-group">
        <label class="form-label">触发位</label>
        <div class="trigger-display">
          <span class="trigger-badge">{{ triggerName }}</span>
        </div>
      </div>
      
      <div class="form-group">
        <label class="form-label">流派</label>
        <div class="input-row">
          <el-form-item prop="sect" class="input-main">
            <el-autocomplete
              v-model="formData.sect"
              :fetch-suggestions="fetchSectListSuggestions"
              placeholder="选择流派"
              clearable
            />
          </el-form-item>
          <el-select v-model="formData.attribute" class="input-side" placeholder="属性" clearable>
            <el-option v-for="attr in attributeList" :key="attr" :value="attr" />
          </el-select>
        </div>
      </div>
      
      <div v-if="filterSectList.length > 0" class="sect-options">
        <div 
          v-for="sect in filterSectList.slice(0, 6)"
          :key="sect.name"
          :class="['sect-option', { 'is-selected': formData.sect === sect.name }]"
          @click="formData.sect = sect.name"
        >
          <span :class="['element-dot', `element-dot--${styleMapper[sect.attribute]}`]"></span>
          <span class="sect-name">{{ sect.name }}</span>
        </div>
      </div>
      
      <div class="button-group">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, watch } from 'vue';
import { Trigger } from '../../interfaces/Trigger.ts';
import { Attribute } from '../../interfaces/Attribute.ts';
import { SectValue } from '../../interfaces/SectValue.ts';
import { sectConfig } from '../../config/sectConfig.ts';
import { useSkillInfoStore } from '../../store/useSkillInfoStore.ts';
import { useSkillCardInfoStore } from '../../store/useSkillCardInfoStore.ts';
import { FormInstance } from 'element-plus';

const props = defineProps<{ triggerName: Trigger }>();
const emit = defineEmits<{ (event: 'closeDialog'): void }>();

const skillInfoStore = useSkillInfoStore();
const skillCardInfoStore = useSkillCardInfoStore();

const formData = reactive({
  triggerName: props.triggerName,
  attribute: '' as Attribute | '',
  sect: '' as SectValue | '',
});

const formRef = ref<FormInstance>();
const rules = { sect: [{ required: true, message: '请选择流派', trigger: 'change' }] };
const attributeList = Object.keys(sectConfig) as Attribute[];

watch(() => formData.sect, (val) => {
  if (val) {
    for (const attr of attributeList) {
      if (sectConfig[attr].includes(val)) formData.attribute = attr;
    }
  }
});

const filterSectList = computed(() => {
  const available = skillInfoStore.triggerInfoList.filter(t => t.trigger.includes(props.triggerName));
  const all: { name: SectValue; attribute: Attribute }[] = [];
  for (const attr of attributeList) {
    sectConfig[attr].forEach(sect => {
      if (available.find(t => t.name === sect)) all.push({ name: sect, attribute: attr });
    });
  }
  return formData.attribute ? all.filter(s => s.attribute === formData.attribute) : all;
});

const fetchSectListSuggestions = (search: string, cb: Function) => {
  const list = filterSectList.value.map(s => ({ value: s.name }));
  cb(search ? list.filter(s => s.value.includes(search)) : list);
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid && formData.sect) {
      skillCardInfoStore.updateSkillCardInfo(props.triggerName, formData.sect);
      handleCancel();
    }
  });
};

const handleCancel = () => {
  formData.sect = '';
  formData.attribute = '';
  emit('closeDialog');
};

const styleMapper: Record<Attribute, string> = {
  '火': 'fire', '冰': 'ice', '电': 'thunder',
  '毒': 'poison', '暗': 'dark', '光': 'light', '刃': 'blade',
};
</script>
```

**Step 5: 验证编译成功**

Run: `pnpm build`
Expected: 构建成功，无错误

**Step 6: Commit**

```bash
git add src/views/SectBuilderPage.vue src/components/SectBuilderPage/
git commit -m "refactor: redesign SectBuilderPage and child components to shadcn style"
```

---

## Task 6: 前端测试验证

**Files:**
- Test: `http://localhost:5174/`

**Step 1: 启动开发服务器**

Run: `pnpm dev`
Expected: 服务器启动成功

**Step 2: 使用 frontend-tester 验证**

- 访问首页，验证浅色模式显示正确
- 点击主题切换按钮，验证深色模式切换正常
- 刷新页面，验证主题持久化
- 导航到流派构建页，验证功能正常

**Step 3: Commit**

```bash
git add -A
git commit -m "test: verify theme switching and shadcn style"
```

---

## 总结

| Task | 描述 | 文件 |
|------|------|------|
| 1 | 创建 useTheme composable | `src/composables/useTheme.ts` |
| 2 | 重构 App.vue CSS 变量 | `src/App.vue` |
| 3 | 重构 PageHeader 添加主题切换 | `src/components/Public/PageHeader.vue` |
| 4 | 重构双重词条筛选页 | `src/components/SearchDoublePage/SearchDoubleEffectForm.vue` |
| 5 | 重构流派构建页及子组件 | `src/views/SectBuilderPage.vue`, `src/components/SectBuilderPage/*` |
| 6 | 前端测试验证 | - |
