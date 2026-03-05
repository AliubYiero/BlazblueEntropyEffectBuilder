<style lang="scss">
/* ============================================
   BLAZBLUE ENTROPY EFFECT BUILDER
   shadcn 风格 UI
   ============================================ */

/* CSS 变量 - shadcn 风格 */
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

/* 深色模式 */
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
	background: var(--background);
}

::-webkit-scrollbar-thumb {
	background: var(--border);
	border-radius: 4px;

	&:hover {
		background: var(--muted-foreground);
	}
}

/* 选择文本 */
::selection {
	background: var(--primary);
	color: var(--primary-foreground);
}

/* Body 样式 */
body {
	font-family: var(--font-sans);
	font-size: 14px;
	line-height: 1.5;
	color: var(--foreground);
	background-color: var(--background);
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
		background: hsl(from var(--accent) h s l / 0.5) !important;
	}

	&.is-active {
		border-bottom: 2px solid var(--primary) !important;
		color: var(--primary) !important;
	}
}

.el-table {
	--el-table-bg-color: transparent;
	--el-table-tr-bg-color: transparent;
	--el-table-header-bg-color: hsl(from var(--muted) h s l / 0.5);
	--el-table-row-hover-bg-color: hsl(from var(--muted) h s l / 0.5);
	--el-table-border-color: var(--border);
	--el-table-text-color: var(--foreground);
	--el-table-header-text-color: var(--foreground);

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
	background: var(--background) !important;
	border: 1px solid var(--border) !important;
	border-radius: calc(var(--radius) - 2px) !important;
	box-shadow: none !important;

	&:hover {
		border-color: var(--ring) !important;
	}

	&.is-focus,
	&:focus-within {
		border-color: var(--ring) !important;
		box-shadow: 0 0 0 1px var(--ring) !important;
	}
}

.el-input__inner {
	color: var(--foreground) !important;
	font-family: var(--font-chinese) !important;

	&::placeholder {
		color: var(--muted-foreground) !important;
	}
}

.el-checkbox {
	font-family: var(--font-chinese) !important;

	.el-checkbox__label {
		color: var(--foreground) !important;
	}

	.el-checkbox__inner {
		background: var(--background) !important;
		border-color: var(--border) !important;
		border-radius: calc(var(--radius) - 4px) !important;
	}

	&.is-checked .el-checkbox__inner {
		background: var(--primary) !important;
		border-color: var(--primary) !important;
	}
}

.el-button {
	font-family: var(--font-chinese) !important;
	border-radius: calc(var(--radius) - 2px) !important;

	&--primary {
		background: var(--primary) !important;
		border-color: var(--primary) !important;
		color: var(--primary-foreground) !important;

		&:hover {
			background: var(--primary) !important;
			opacity: 0.9;
		}
	}
}

.el-dialog {
	background: var(--card) !important;
	border: 1px solid var(--border) !important;
	border-radius: var(--radius) !important;

	.el-dialog__header {
		border-bottom: 1px solid var(--border) !important;
		padding: 16px 20px !important;
	}

	.el-dialog__title {
		font-family: var(--font-chinese) !important;
		font-weight: 600;
		color: var(--foreground) !important;
	}

	.el-dialog__body {
		padding: 20px !important;
	}
}

.el-divider {
	border-color: var(--border) !important;
}

.el-select-dropdown {
	background: var(--popover) !important;
	border: 1px solid var(--border) !important;
	border-radius: calc(var(--radius) - 2px) !important;

	.el-select-dropdown__item {
		font-family: var(--font-chinese) !important;
		color: var(--foreground) !important;

		&:hover {
			background: hsl(from var(--accent) h s l / 0.5) !important;
		}

		&.is-selected {
			color: var(--primary) !important;
		}
	}
}

.el-form-item__label {
	font-family: var(--font-chinese) !important;
	color: var(--foreground) !important;
}

/* ===== 元素颜色工具类 ===== */
.element-fire {
	color: var(--element-fire);
}

.element-ice {
	color: var(--element-ice);
}

.element-thunder {
	color: var(--element-thunder);
}

.element-poison {
	color: var(--element-poison);
}

.element-dark {
	color: var(--element-dark);
}

.element-light {
	color: var(--element-light);
}

.element-blade {
	color: var(--element-blade);
}

/* 元素圆点 */
.element-dot {
	display: inline-block;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	margin-right: 6px;

	&--fire {
		background: var(--element-fire);
	}

	&--ice {
		background: var(--element-ice);
	}

	&--thunder {
		background: var(--element-thunder);
	}

	&--poison {
		background: var(--element-poison);
	}

	&--dark {
		background: var(--element-dark);
	}

	&--light {
		background: var(--element-light);
	}

	&--blade {
		background: var(--element-blade);
	}
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
