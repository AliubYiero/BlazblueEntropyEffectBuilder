# CSS 变量 HSL 格式重构设计文档

## 概述

将项目中 CSS 变量的定义方式从分开的 HSL 分量格式改为直接的 `hsl()` 函数格式，同时相应更新所有使用方。

## 背景

当前 CSS 变量定义：
```css
--background: 0 0% 100%;  /* HSL 分量分开 */
```

使用方式：
```css
background: hsl(var(--background));  /* 需要额外包装 hsl() */
```

目标格式：
```css
--background: hsl(0 0% 100%);  /* 直接定义完整 HSL */
```

使用方式：
```css
background: var(--background);  /* 直接使用变量 */
```

## 架构

- **修改范围**：9 个 Vue 单文件组件的 `<style>` 部分
- **修改类型**：纯样式重构，无架构变更
- **变量作用域**：全局 CSS 变量（`:root` 和 `.dark`）

## 涉及文件

1. `src/App.vue` - CSS 变量定义 + 33 处使用方
2. `src/views/SectBuilderPage.vue` - 5 处使用方
3. `src/views/SearchDoublePage.vue` - 待确认
4. `src/components/Public/PageHeader.vue` - 10 处使用方
5. `src/components/Public/SkillCard.vue` - 13 处使用方
6. `src/components/SectBuilderPage/SelectSkillCard.vue` - 8 处使用方
7. `src/components/SectBuilderPage/SelectableSkillCard.vue` - 2 处使用方
8. `src/components/SectBuilderPage/ChangeSkillSectForm.vue` - 18 处使用方
9. `src/components/SearchDoublePage/SearchDoubleEffectForm.vue` - 9 处使用方

## 组件修改细节

### App.vue 变量定义修改

共 39 个变量（`:root` 中 27 个 + `.dark` 中 18 个，含重复）。

**修改前：**
```css
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--element-fire: 0 84% 60%;
```

**修改后：**
```css
--background: hsl(0 0% 100%);
--foreground: hsl(222.2 84% 4.9%);
--element-fire: hsl(0 84% 60%);
```

### 使用方修改模式

**普通颜色：**
```css
/* 修改前 */
background: hsl(var(--background));
color: hsl(var(--foreground));

/* 修改后 */
background: var(--background);
color: var(--foreground);
```

**带透明度：**
```css
/* 修改前 */
background: hsl(var(--accent) / 0.5);

/* 修改后 - 使用 CSS Color Module Level 5 语法 */
background: hsl(from var(--accent) h s l / 0.5);
```

## 数据流

无数据流变更。CSS 变量仍为全局共享的样式常量。

## 错误处理

| 风险 | 应对措施 |
|------|----------|
| 遗漏 `hsl(var(--xxx))` | 全局搜索验证无残留 |
| 透明度过渡语法不兼容 | 项目使用现代浏览器，支持 `hsl(from ...)` |
| 变量名拼写错误 | 使用批量替换，避免手动输入 |
| 主题切换异常 | 验证 `.dark` 类下变量定义 |

## 回滚策略

- 所有修改通过 Git 跟踪
- 建议分两次提交：先改 App.vue 变量定义，再改使用方

## 测试清单

1. **构建测试**：`pnpm build` 无错误
2. **视觉回归**：
   - 浅色模式颜色正常
   - 深色模式颜色正常
   - 带透明度元素（表格悬停、输入框聚焦）正常
3. **功能验证**：
   - 双重词条筛选页
   - 流派构建页
   - 页面头部导航
4. **自动化验证**：
   - 全局搜索无 `hsl(var(--` 残留
   - 所有变量定义为 `hsl(...)` 格式

## 决策记录

- **方案选择**：方案 B（逐个文件手动修改）
- **透明度处理**：使用 `hsl(from var(--xxx) h s l / alpha)` 语法
- **修改顺序**：先 App.vue 变量定义，再其他文件使用方
