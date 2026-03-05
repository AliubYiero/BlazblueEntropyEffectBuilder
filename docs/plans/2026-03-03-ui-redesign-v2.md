# UI Redesign v2 Implementation Plan

>
*
*For
Claude:
** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

*
*Goal:
** 根据 design-v2.html 重新设计UI，优化顶部导航为一级分段控制器样式，优化流派配置对话框的视觉层次和交互，整体页面更加紧凑

*
*Architecture:
**

1. 修改 PageHeader 组件，将 el-menu 替换为自定义分段控制器导航
2. 重写 ChangeSkillSectForm 组件，采用玻璃拟态设计，优化属性选择器和流派网格布局
3. 调整全局样式变量和页面间距，使布局更紧凑

*
*Tech
Stack:
** Vue 3 + Element Plus + SCSS

---

## Reference Design

设计文档位置:
`docs/ui/design-v2.html`

关键设计变更:

-
*
*顶部导航
**: 高度从 64px 减少到 52px，使用分段控制器样式（圆角胶囊背景+渐变激活状态）
-
*
*对话框
**: 玻璃拟态背景，章节标题使用装饰条+大写字母样式，属性选择器7列网格，流派3列网格
-
*
*紧凑布局
**: 卡片内边距从 16px 减少到 12px，页面边距减少，字体大小微调

---

## Prerequisites

```bash
# 确保开发服务器可运行
pnpm install
pnpm dev
```

---

## Task 1: 更新全局CSS变量 (App.vue)

*
*Files:
**

- Modify:
  `src/App.vue:1-100`

*
*变更说明:
**
添加新的CSS变量支持玻璃拟态设计，保持原有变量兼容

*
*Step
1:
添加新的深色主题变量
**

在
`:root` 中添加新的设计系统变量:

```scss
:root {
  // 原有浅色主题变量保持不变...
  
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
```

*
*Step
2:
验证CSS变量生效
**

在浏览器 DevTools 中检查
`:root` 是否包含新变量

*
*Step
3:
Commit
**

```bash
git add src/App.vue
git commit -m "feat: add dark theme CSS variables for glass morphism design"
```

---

## Task 2: 重构顶部导航组件 (PageHeader.vue)

*
*Files:
**

- Modify:
  `src/components/Public/PageHeader.vue`

*
*变更说明:
**
将 el-menu 替换为自定义分段控制器导航，高度从 64px 减少到 52px

*
*Step
1:
完整替换组件代码
**

```vue
<style lang="scss" scoped>
.header {
  &-container {
    background: rgba(10, 15, 26, 0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    position: sticky;
    top: 0;
    z-index: 100;
    height: 52px;
  }
  
  &-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }
  
  &-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    
    &-logo {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
    }
    
    &-title {
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }
  }
  
  &-nav {
    display: flex;
    gap: 4px;
    background: rgba(255, 255, 255, 0.04);
    padding: 4px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
  border: none;
  background: transparent;
  
  &:hover {
    color: rgba(255, 255, 255, 0.85);
    background: rgba(255, 255, 255, 0.05);
  }
  
  &.active {
    color: #fff;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.35);
  }
  
  :deep(svg) {
    width: 14px;
    height: 14px;
  }
}
</style>

<template>
  <header class="header-container">
    <div class="header-content">
      <div class="header-brand">
        <div class="header-brand-logo">⚔️</div>
        <span class="header-brand-title">苍翼构建器</span>
      </div>
      <nav class="header-nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="['nav-item', { active: isActive(item.path) }]"
        >
          <el-icon :size="14">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Search, Collection } from '@element-plus/icons-vue';

const route = useRoute();

const navItems = [
  { path: '/', label: '筛选', icon: Search },
  { path: '/builder', label: '构建', icon: Collection },
];

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};
</script>
```

*
*Step
2:
验证导航渲染
**

运行开发服务器，检查:

1. 导航高度为 52px
2. 分段控制器样式正确（圆角胶囊背景）
3. 激活状态有渐变背景
4. 切换页面时激活状态正确更新

*
*Step
3:
Commit
**

```bash
git add src/components/Public/PageHeader.vue
git commit -m "feat: redesign header with segmented control navigation"
```

---

## Task 3: 更新主布局样式 (App.vue)

*
*Files:
**

- Modify:
  `src/App.vue:80-120`

*
*变更说明:
**
调整主内容区域的上边距，从 64px+24px 减少到 52px+16px

*
*Step
1:
修改
main-content
样式
**

```scss
.main-content {
  flex: 1;
  padding: calc(52px + var(--spacing-md)) var(--spacing-md) var(--spacing-md);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
```

*
*Step
2:
验证布局
**

检查页面内容是否与顶部导航有合适的间距（约 68px）

*
*Step
3:
Commit
**

```bash
git add src/App.vue
git commit -m "style: reduce main content top padding for compact layout"
```

---

## Task 4: 重构流派配置对话框 (ChangeSkillSectForm.vue)

*
*Files:
**

- Modify:
  `src/components/SectBuilderPage/ChangeSkillSectForm.vue`

*
*变更说明:
**
完全重写样式，采用玻璃拟态设计，属性选择器使用7列网格，流派使用3列网格

*
*Step
1:
完整替换组件代码
**

```vue
<style lang="scss" scoped>
.form {
  &-container {
    padding: 0;
  }
  
  &-section {
    margin-bottom: 14px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &-title {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.4);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      display: flex;
      align-items: center;
      gap: 6px;
      
      &::before {
        content: '';
        width: 3px;
        height: 10px;
        background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
        border-radius: 2px;
      }
    }
  }
  
  &-trigger {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: rgba(102, 126, 234, 0.12);
    border: 1px solid rgba(102, 126, 234, 0.25);
    border-radius: 8px;
    font-size: 13px;
    color: #8b9eff;
    font-weight: 600;
    
    &-icon {
      width: 14px;
      height: 14px;
    }
  }
}

// 属性选择器 - 7列网格
.attr-selector {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.attr-item {
  aspect-ratio: 1;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  position: relative;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.15);
  }
  
  &.active {
    border-color: #8b9eff;
    box-shadow: 0 0 0 2px rgba(139, 158, 255, 0.25), 0 4px 12px rgba(102, 126, 234, 0.3);
    
    &::after {
      content: '✓';
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 14px;
      height: 14px;
      background: #8b9eff;
      border-radius: 50%;
      font-size: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: bold;
    }
  }
  
  // 属性颜色
  &__fire { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
  &__ice { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
  &__thunder { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
  &__poison { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
  &__dark { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); }
  &__light { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); }
  &__cut { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }
}

// 流派网格 - 3列
.sect-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 4px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
}

.sect-item {
  padding: 10px 6px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    border-color: rgba(102, 126, 234, 0.25);
    color: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }
  
  &.selected {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
    border-color: transparent;
    color: #fff;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }
  
  &.disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }
}

// 操作按钮
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

// 自定义按钮样式
.btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  
  &-default {
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.15);
    }
  }
  
  &-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.35);
    
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.45);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

// 空状态
.empty-state {
  text-align: center;
  padding: 32px 20px;
  color: rgba(255, 255, 255, 0.35);
  
  &-icon {
    font-size: 40px;
    margin-bottom: 10px;
    opacity: 0.4;
  }
  
  &-text {
    font-size: 12px;
  }
}
</style>

<template>
  <div class="form-container">
    <!-- 当前触发位 -->
    <div class="form-section">
      <div class="form-section-title">当前技能位</div>
      <span class="form-trigger">
        <svg class="form-trigger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v20M2 12h20"/>
        </svg>
        {{ props.triggerName }}
      </span>
    </div>
    
    <!-- 属性选择 -->
    <div class="form-section">
      <div class="form-section-title">选择属性</div>
      <div class="attr-selector">
        <div
          v-for="attr in attributeList"
          :key="attr"
          :class="[
            'attr-item',
            `attr-item__${styleMapper[attr]}`,
            { active: formData.attribute === attr }
          ]"
          @click="selectAttribute(attr)"
        >
          {{ attrIcons[attr] }}
        </div>
      </div>
    </div>
    
    <!-- 流派选择 -->
    <div class="form-section">
      <div class="form-section-title">选择流派</div>
      <div v-if="formData.attribute" class="sect-grid">
        <div
          v-for="(sect, index) in availableSects"
          :key="index"
          :class="[
            'sect-item',
            { selected: formData.sect === sect }
          ]"
          @click="selectSect(sect as SectValue)"
        >
          {{ sect }}
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-text">请先选择属性</div>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="form-actions">
      <button class="btn btn-default" @click="handleClear">
        清空
      </button>
      <button class="btn btn-primary" :disabled="!formData.sect" @click="handleSubmit">
        确定
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Trigger } from '../../interfaces/Trigger.ts';
import { computed, reactive, watch } from 'vue';
import { sectConfig } from '../../config/sectConfig.ts';
import { Attribute } from '../../interfaces/Attribute.ts';
import { SectValue } from '../../interfaces/SectValue.ts';
import { useSkillInfoStore } from '../../store/useSkillInfoStore.ts';
import { useSkillCardInfoStore } from '../../store/useSkillCardInfoStore.ts';

const props = defineProps<{
  triggerName: Trigger;
}>();

const emits = defineEmits<{
  (event: 'closeDialog'): void;
}>();

// 样式和图标映射
const styleMapper: Record<string, string> = {
  '火': 'fire',
  '冰': 'ice',
  '电': 'thunder',
  '毒': 'poison',
  '光': 'light',
  '暗': 'dark',
  '刃': 'cut',
};

const attrIcons: Record<string, string> = {
  '火': '🔥',
  '冰': '❄️',
  '电': '⚡',
  '毒': '☠️',
  '光': '✨',
  '暗': '🌑',
  '刃': '⚔️',
};

// 表单数据
const formData = reactive({
  triggerName: props.triggerName,
  attribute: '' as Attribute | '',
  sect: '' as SectValue | '',
});

// 获取所有属性
const attributeList = computed(() => Object.keys(sectConfig) as Attribute[]);

// 根据触发位过滤可用的流派
const availableSects = computed(() => {
  if (!formData.attribute) return [];
  
  const skillInfoStore = useSkillInfoStore();
  const allSects = sectConfig[formData.attribute];
  
  // 过滤出支持当前触发位的流派
  return allSects.filter(sect => {
    const triggerInfo = skillInfoStore.triggerInfoList.find(info => info.name === sect);
    if (!triggerInfo) return false;
    return triggerInfo.trigger.includes(props.triggerName);
  });
});

// 选择属性
const selectAttribute = (attr: Attribute) => {
  if (formData.attribute === attr) {
    formData.attribute = '';
    formData.sect = '';
  } else {
    formData.attribute = attr;
    formData.sect = '';
  }
};

// 选择流派
const selectSect = (sect: SectValue) => {
  formData.sect = sect;
};

// 清空选择
const handleClear = () => {
  formData.attribute = '';
  formData.sect = '';
};

// 提交
const handleSubmit = () => {
  if (!formData.sect) return;
  
  const skillCardInfoStore = useSkillCardInfoStore();
  skillCardInfoStore.updateSkillCardInfo(formData.triggerName, formData.sect);
  
  handleEmitCloseDialog();
};

// 关闭对话框
const handleEmitCloseDialog = () => {
  formData.sect = '';
  formData.attribute = '';
  emits('closeDialog');
};

// 监听属性变化，自动清空流派
watch(() => formData.attribute, () => {
  formData.sect = '';
});
</script>
```

*
*Step
2:
更新
SkillCard.vue
中的对话框样式
**

修改 SkillCard.vue 中的 el-dialog，添加自定义类名:

```vue
<el-dialog
  v-model="isShowDialog"
  title="配置流派"
  width="420"
  align-center
  destroy-on-close
  custom-class="sect-config-dialog"
>
```

*
*Step
3:
验证对话框样式
**

检查:

1. 属性选择器是7列网格，每个属性有正确的渐变背景
2. 流派网格是3列，样式符合设计
3. 章节标题有装饰条和大写字母样式
4. 按钮有渐变背景

*
*Step
4:
Commit
**

```bash
git add src/components/SectBuilderPage/ChangeSkillSectForm.vue
git add src/components/SectBuilderPage/SelectSkillCard.vue
git commit -m "feat: redesign ChangeSkillSectForm with glass morphism and compact grid layout"
```

---

## Task 5: 更新对话框全局样式 (App.vue)

*
*Files:
**

- Modify:
  `src/App.vue:100-200`

*
*变更说明:
**
添加 Element Plus 对话框的自定义样式，实现玻璃拟态效果

*
*Step
1:
添加对话框覆盖样式
**

在
`App.vue` 的
`<style lang="scss">` 部分添加:

```scss
// Element Plus Dialog 自定义样式
.sect-config-dialog {
  background: rgba(20, 25, 40, 0.98) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  
  .el-dialog__header {
    padding: 14px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(255, 255, 255, 0.02);
    margin-right: 0;
    
    .el-dialog__title {
      font-size: 15px;
      font-weight: 600;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  
  .el-dialog__headerbtn {
    width: 26px;
    height: 26px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    top: 12px;
    right: 12px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.12);
    }
    
    .el-dialog__close {
      color: rgba(255, 255, 255, 0.4);
      font-size: 12px;
      
      &:hover {
        color: #fff;
      }
    }
  }
  
  .el-dialog__body {
    padding: 14px 16px;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .el-dialog__footer {
    padding: 12px 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(255, 255, 255, 0.02);
  }
}

// 遮罩层样式
.el-overlay {
  background-color: rgba(0, 0, 0, 0.75) !important;
  backdrop-filter: blur(6px);
}
```

*
*Step
2:
验证对话框外观
**

打开流派配置对话框，检查:

1. 对话框有深色半透明背景
2. 边框和圆角符合设计
3. 遮罩层有模糊效果

*
*Step
3:
Commit
**

```bash
git add src/App.vue
git commit -m "style: add custom dialog styles for glass morphism effect"
```

---

## Task 6: 优化流派构建页面布局 (SectBuilderPage.vue)

*
*Files:
**

- Modify:
  `src/views/SectBuilderPage.vue`

*
*变更说明:
**
调整页面间距，使其更紧凑

*
*Step
1:
更新页面样式
**

```vue
<style lang="scss" scoped>
.page {
  &-container {
    padding: 0 4px;
  }
  
  &-header {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    &-title {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin: 0;
    }
    
    &-desc {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
      margin: 0;
    }
  }
}

.builder {
  &-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  &-enabled {
    background: rgba(16, 185, 129, 0.04);
    border: 1px solid rgba(16, 185, 129, 0.12);
    border-radius: 10px;
    padding: 12px;
  }
  
  &-skills {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  &-skill {
    &-item {
      display: flex;
      gap: 12px;
      align-items: stretch;
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 12px;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: rgba(102, 126, 234, 0.25);
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1);
      }
    }
  }
}
</style>

<template>
  <div class="page-container">
    <header class="page-header">
      <div>
        <h1 class="page-header-title">流派构建</h1>
        <p class="page-header-desc">配置技能位流派，自动计算可激活策略</p>
      </div>
    </header>
    
    <main class="builder-container">
      <!-- 可激活双重策略 -->
      <section class="builder-enabled">
        <enabled-double-skill/>
      </section>
      
      <!-- 技能位配置 -->
      <section class="builder-skills">
        <div 
          v-for="skillCardInfo in skillCardInfoList" 
          :key="skillCardInfo.triggerName"
          class="builder-skill-item"
        >
          <skill-card :skill-card-info="skillCardInfo"/>
          <selectable-skill-card :skill-card-info="skillCardInfo"/>
        </div>
      </section>
    </main>
  </div>
</template>
```

*
*Step
2:
验证页面布局
**

检查:

1. 页面标题更紧凑
2. 卡片间距减少到 10px
3. 卡片内边距减少到 12px
4. 悬停效果正确

*
*Step
3:
Commit
**

```bash
git add src/views/SectBuilderPage.vue
git commit -m "style: optimize SectBuilderPage layout for compact design"
```

---

## Task 7: 优化双重词条筛选页面 (SearchDoublePage.vue)

*
*Files:
**

- Modify:
  `src/views/SearchDoublePage.vue`

*
*变更说明:
**
调整页面间距，与构建页保持一致

*
*Step
1:
更新页面样式
**

```vue
<style lang="scss" scoped>
.page {
  &-container {
    padding: 0 4px;
  }
  
  &-header {
    margin-bottom: 12px;
    
    &-title {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin: 0 0 4px 0;
    }
    
    &-desc {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
      margin: 0;
    }
  }
}
</style>

<template>
  <div class="page-container">
    <header class="page-header">
      <h1 class="page-header-title">双重词条筛选</h1>
      <p class="page-header-desc">根据属性、流派和触发位筛选策略</p>
    </header>
    <search-double-effect-form/>
  </div>
</template>
```

*
*Step
2:
Commit
**

```bash
git add src/views/SearchDoublePage.vue
git commit -m "style: optimize SearchDoublePage layout for compact design"
```

---

## Task 8: 运行测试和构建验证

*
*Step
1:
运行类型检查
**

```bash
pnpm vue-tsc --noEmit
```

Expected: 无类型错误

*
*Step
2:
运行构建
**

```bash
pnpm build
```

Expected: 构建成功，无错误

*
*Step
3:
最终提交
**

```bash
git add .
git commit -m "feat: complete UI redesign v2 - compact layout, glass morphism, segmented navigation"
```

---

## Summary

此实施计划包含8个任务，将 design-v2.html 的设计变更应用到代码中:

1.
*
*全局变量
** - 添加深色主题和玻璃拟态CSS变量
2.
*
*顶部导航
** - 重构为分段控制器样式，高度52px
3.
*
*主布局
** - 调整内容区域上边距
4.
*
*配置对话框
** - 完全重写，7列属性选择器+3列流派网格
5.
*
*对话框样式
** - 全局玻璃拟态对话框样式
6.
*
*构建页面
** - 紧凑布局，减少间距
7.
*
*筛选页面
** - 紧凑布局，与构建页一致
8.
*
*验证
** - 类型检查和构建验证

所有变更保持与原有功能的兼容性，仅修改样式和布局。
