<style lang="scss">
/* ============================================
   BLAZBLUE ENTROPY EFFECT BUILDER
   shadcn 风格 UI
   ============================================ */

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
	background: hsl(var(--background));
}

::-webkit-scrollbar-thumb {
	background: hsl(var(--border));
	border-radius: 4px;
	
	&:hover {
		background: hsl(var(--muted-foreground));
	}
}

/* 选择文本 */
::selection {
	background: hsl(var(--primary));
	color: hsl(var(--primary-foreground));
}

/* Body 样式 */
body {
	font-family: var(--font-sans);
	font-size: 14px;
	line-height: 1.5;
	color: hsl(var(--foreground));
	background-color: hsl(var(--background));
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
		background: hsl(var(--accent) / 0.5) !important;
	}
	
	&.is-active {
		border-bottom: 2px solid hsl(var(--primary)) !important;
		color: hsl(var(--primary)) !important;
	}
}

.el-table {
	--el-table-bg-color: transparent;
	--el-table-tr-bg-color: transparent;
	--el-table-header-bg-color: hsl(var(--muted) / 0.5);
	--el-table-row-hover-bg-color: hsl(var(--muted) / 0.5);
	--el-table-border-color: hsl(var(--border));
	--el-table-text-color: hsl(var(--foreground));
	--el-table-header-text-color: hsl(var(--foreground));
	
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
	background: hsl(var(--background)) !important;
	border: 1px solid hsl(var(--border)) !important;
	border-radius: calc(var(--radius) - 2px) !important;
	box-shadow: none !important;
	
	&:hover {
		border-color: hsl(var(--ring)) !important;
	}
	
	&.is-focus,
	&:focus-within {
		border-color: hsl(var(--ring)) !important;
		box-shadow: 0 0 0 1px hsl(var(--ring)) !important;
	}
}

.el-input__inner {
	color: hsl(var(--foreground)) !important;
	font-family: var(--font-chinese) !important;
	
	&::placeholder {
		color: hsl(var(--muted-foreground)) !important;
	}
}

.el-checkbox {
	font-family: var(--font-chinese) !important;
	
	.el-checkbox__label {
		color: hsl(var(--foreground)) !important;
	}
	
	.el-checkbox__inner {
		background: hsl(var(--background)) !important;
		border-color: hsl(var(--border)) !important;
		border-radius: calc(var(--radius) - 4px) !important;
	}
	
	&.is-checked .el-checkbox__inner {
		background: hsl(var(--primary)) !important;
		border-color: hsl(var(--primary)) !important;
	}
}

.el-button {
	font-family: var(--font-chinese) !important;
	border-radius: calc(var(--radius) - 2px) !important;
	
	&--primary {
		background: hsl(var(--primary)) !important;
		border-color: hsl(var(--primary)) !important;
		color: hsl(var(--primary-foreground)) !important;
		
		&:hover {
			background: hsl(var(--primary)) !important;
			opacity: 0.9;
		}
	}
}

.el-dialog {
	background: hsl(var(--card)) !important;
	border: 1px solid hsl(var(--border)) !important;
	border-radius: var(--radius) !important;
	
	.el-dialog__header {
		border-bottom: 1px solid hsl(var(--border)) !important;
		padding: 16px 20px !important;
	}
	
	.el-dialog__title {
		font-family: var(--font-chinese) !important;
		font-weight: 600;
		color: hsl(var(--foreground)) !important;
	}
	
	.el-dialog__body {
		padding: 20px !important;
	}
}

.el-divider {
	border-color: hsl(var(--border)) !important;
}

.el-select-dropdown {
	background: hsl(var(--popover)) !important;
	border: 1px solid hsl(var(--border)) !important;
	border-radius: calc(var(--radius) - 2px) !important;
	
	.el-select-dropdown__item {
		font-family: var(--font-chinese) !important;
		color: hsl(var(--foreground)) !important;
		
		&:hover {
			background: hsl(var(--accent) / 0.5) !important;
		}
		
		&.is-selected {
			color: hsl(var(--primary)) !important;
		}
	}
}

.el-form-item__label {
	font-family: var(--font-chinese) !important;
	color: hsl(var(--foreground)) !important;
}

/* ===== 元素颜色工具类 ===== */
.element-fire {
	color: hsl(var(--element-fire));
}

.element-ice {
	color: hsl(var(--element-ice));
}

.element-thunder {
	color: hsl(var(--element-thunder));
}

.element-poison {
	color: hsl(var(--element-poison));
}

.element-dark {
	color: hsl(var(--element-dark));
}

.element-light {
	color: hsl(var(--element-light));
}

.element-blade {
	color: hsl(var(--element-blade));
}

/* 元素圆点 */
.element-dot {
	display: inline-block;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	margin-right: 6px;
	
	&--fire {
		background: hsl(var(--element-fire));
	}
	
	&--ice {
		background: hsl(var(--element-ice));
	}
	
	&--thunder {
		background: hsl(var(--element-thunder));
	}
	
	&--poison {
		background: hsl(var(--element-poison));
	}
	
	&--dark {
		background: hsl(var(--element-dark));
	}
	
	&--light {
		background: hsl(var(--element-light));
	}
	
	&--blade {
		background: hsl(var(--element-blade));
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
