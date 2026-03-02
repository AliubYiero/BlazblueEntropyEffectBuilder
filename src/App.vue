<style lang="scss">
// 全局CSS变量 - 浅色主题
:root {
  // 主色调
  --color-primary: #409eff;
  --color-primary-light: #ecf5ff;
  --color-primary-dark: #337ecc;
  
  // 背景色
  --bg-primary: #f5f7fa;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f0f2f5;
  
  // 文字色
  --text-primary: #303133;
  --text-secondary: #606266;
  --text-tertiary: #909399;
  --text-placeholder: #a8abb2;
  
  // 边框色
  --border-primary: #dcdfe6;
  --border-secondary: #e4e7ed;
  --border-tertiary: #ebeef5;
  
  // 阴影
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  
  // 圆角
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  // 间距
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  // 属性色彩系统
  --attr-fire: #ff6b6b;
  --attr-fire-bg: #fff0f0;
  --attr-ice: #4dabf7;
  --attr-ice-bg: #e7f5ff;
  --attr-thunder: #ffd43b;
  --attr-thunder-bg: #fff9db;
  --attr-thunder-text: #5c4b00;
  --attr-poison: #69db7c;
  --attr-poison-bg: #d3f9d8;
  --attr-poison-text: #0d3b12;
  --attr-dark: #495057;
  --attr-dark-bg: #f1f3f5;
  --attr-light: #fcc419;
  --attr-light-bg: #fff9db;
  --attr-light-text: #5c4b00;
  --attr-cut: #adb5bd;
  --attr-cut-bg: #f8f9fa;

  // 新增深色主题变量 (玻璃拟态)
  --dark-bg-primary: #0a0f1a;
  --dark-bg-secondary: #141928;
  --dark-bg-tertiary: rgba(255, 255, 255, 0.03);

  // 玻璃拟态
  --glass-bg: rgba(255, 255, 255, 0.025);
  --glass-border: rgba(255, 255, 255, 0.06);
  --glass-backdrop: blur(10px);

  // 渐变主色
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-primary-soft: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);

  // 深色主题文字
  --dark-text-primary: #ffffff;
  --dark-text-secondary: rgba(255, 255, 255, 0.7);
  --dark-text-tertiary: rgba(255, 255, 255, 0.4);

  // 强调色
  --accent-purple: #8b9eff;
  --accent-purple-light: rgba(139, 158, 255, 0.25);
}

// 全局样式重置
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

// Element Plus 样式覆盖
.el-table {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  
  th.el-table__cell {
    background-color: var(--bg-tertiary) !important;
    color: var(--text-primary);
    font-weight: 600;
  }
  
  .el-table__row:hover > td {
    background-color: var(--color-primary-light) !important;
  }
}

.el-card {
  border-radius: var(--radius-md);
  border: 1px solid var(--border-secondary);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: var(--shadow-md);
  }
}

.el-button {
  border-radius: var(--radius-sm);
}

.el-input__wrapper,
.el-textarea__inner {
  border-radius: var(--radius-sm);
}

.el-dialog {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.el-menu {
  border-bottom: 1px solid var(--border-secondary);
}
</style>

<style lang="scss" scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: calc(64px + var(--spacing-lg)) var(--spacing-lg) var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
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