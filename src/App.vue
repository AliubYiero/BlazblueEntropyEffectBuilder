<style lang="scss">
/* ============================================
   BLAZBLUE ENTROPY EFFECT BUILDER
   赛博朋克 × 格斗游戏风格 UI
   ============================================ */

/* Google Fonts - 特色字体 */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Noto+Sans+SC:wght@300;400;500;600;700&family=Rajdhani:wght@300;400;500;600;700&display=swap');

/* CSS 变量 - 主题色 */
:root {
	/* 背景 */
	--bg-primary: #0a0a0f;
	--bg-secondary: #12121a;
	--bg-tertiary: #1a1a25;
	--bg-card: rgba(20, 20, 30, 0.85);
	--bg-card-hover: rgba(30, 30, 45, 0.9);
	
	/* 边框 */
	--border-primary: rgba(255, 255, 255, 0.08);
	--border-glow: rgba(0, 212, 255, 0.3);
	
	/* 文字 */
	--text-primary: #e8e8f0;
	--text-secondary: #8a8a9a;
	--text-muted: #5a5a6a;
	
	/* 元素色 - 霓虹高饱和 */
	--element-fire: #ff3d3d;
	--element-fire-glow: rgba(255, 61, 61, 0.4);
	--element-ice: #00d4ff;
	--element-ice-glow: rgba(0, 212, 255, 0.4);
	--element-thunder: #ffd000;
	--element-thunder-glow: rgba(255, 208, 0, 0.4);
	--element-poison: #b366ff;
	--element-poison-glow: rgba(179, 102, 255, 0.4);
	--element-dark: #8b5cf6;
	--element-dark-glow: rgba(139, 92, 246, 0.4);
	--element-light: #fbbf24;
	--element-light-glow: rgba(251, 191, 36, 0.4);
	--element-blade: #94a3b8;
	--element-blade-glow: rgba(148, 163, 184, 0.4);
	
	/* 强调色 */
	--accent-primary: #00d4ff;
	--accent-secondary: #ff3d3d;
	--accent-gradient: linear-gradient(135deg, #00d4ff 0%, #ff3d3d 100%);
	
	/* 字体 */
	--font-display: 'Orbitron', 'Noto Sans SC', sans-serif;
	--font-body: 'Rajdhani', 'Noto Sans SC', sans-serif;
	--font-chinese: 'Noto Sans SC', sans-serif;
	
	/* 动画 */
	--transition-fast: 0.15s ease;
	--transition-normal: 0.3s ease;
	--transition-slow: 0.5s ease;
}

/* 全局重置 */
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

/* 滚动条样式 */
::-webkit-scrollbar {
	width: 8px;
	height: 8px;
}

::-webkit-scrollbar-track {
	background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
	background: var(--border-glow);
	border-radius: 4px;
	
	&:hover {
		background: var(--accent-primary);
	}
}

/* 选择文本样式 */
::selection {
	background: var(--accent-primary);
	color: var(--bg-primary);
}

/* Body 样式 */
body {
	font-family: var(--font-body);
	font-size: 16px;
	line-height: 1.6;
	color: var(--text-primary);
	background: var(--bg-primary);
	overflow-x: hidden;
	
	/* 动态背景网格 */
	&::before {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: 
			linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
		background-size: 50px 50px;
		pointer-events: none;
		z-index: -1;
	}
	
	/* 角落光晕 */
	&::after {
		content: '';
		position: fixed;
		top: -50%;
		right: -50%;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 50%);
		pointer-events: none;
		z-index: -1;
	}
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
	padding: 0;
	position: relative;
}

/* 覆盖 Element Plus 默认样式 */
.el-menu {
	background: transparent !important;
	border: none !important;
}

.el-menu-item {
	font-family: var(--font-display) !important;
	letter-spacing: 2px !important;
	
	&:hover {
		background: rgba(0, 212, 255, 0.1) !important;
	}
	
	&.is-active {
		border-bottom: 2px solid var(--accent-primary) !important;
		color: var(--accent-primary) !important;
		background: rgba(0, 212, 255, 0.1) !important;
	}
}

/* 表格样式覆盖 */
.el-table {
	--el-table-bg-color: transparent;
	--el-table-tr-bg-color: transparent;
	--el-table-header-bg-color: rgba(0, 212, 255, 0.05);
	--el-table-row-hover-bg-color: rgba(0, 212, 255, 0.08);
	--el-table-border-color: var(--border-primary);
	--el-table-text-color: var(--text-primary);
	--el-table-header-text-color: var(--accent-primary);
	
	font-family: var(--font-chinese) !important;
	
	.el-table__header th {
		font-family: var(--font-display) !important;
		font-weight: 600;
		letter-spacing: 1px;
		text-transform: uppercase;
		font-size: 13px;
	}
}

/* 输入框样式覆盖 */
.el-input__wrapper,
.el-autocomplete .el-input__wrapper,
.el-select .el-input__wrapper {
	background: var(--bg-card) !important;
	border: 1px solid var(--border-primary) !important;
	box-shadow: none !important;
	border-radius: 8px !important;
	transition: all var(--transition-normal) !important;
	
	&:hover {
		border-color: var(--border-glow) !important;
	}
	
	&.is-focus,
	&:focus-within {
		border-color: var(--accent-primary) !important;
		box-shadow: 0 0 20px rgba(0, 212, 255, 0.15) !important;
	}
}

.el-input__inner {
	color: var(--text-primary) !important;
	font-family: var(--font-chinese) !important;
	
	&::placeholder {
		color: var(--text-muted) !important;
	}
}

/* 复选框样式覆盖 */
.el-checkbox {
	font-family: var(--font-chinese) !important;
	
	.el-checkbox__label {
		color: var(--text-secondary) !important;
		transition: color var(--transition-fast);
	}
	
	&.is-checked {
		.el-checkbox__label {
			color: var(--accent-primary) !important;
		}
	}
	
	.el-checkbox__inner {
		background: var(--bg-card) !important;
		border-color: var(--border-primary) !important;
		border-radius: 4px !important;
	}
	
	&.is-checked .el-checkbox__inner {
		background: var(--accent-primary) !important;
		border-color: var(--accent-primary) !important;
	}
}

/* 按钮样式覆盖 */
.el-button {
	font-family: var(--font-display) !important;
	letter-spacing: 1px !important;
	border-radius: 8px !important;
	transition: all var(--transition-normal) !important;
	
	&--primary {
		background: var(--accent-primary) !important;
		border-color: var(--accent-primary) !important;
		color: var(--bg-primary) !important;
		font-weight: 600 !important;
		
		&:hover {
			background: #00e5ff !important;
			border-color: #00e5ff !important;
			box-shadow: 0 0 30px rgba(0, 212, 255, 0.4) !important;
			transform: translateY(-2px);
		}
	}
}

/* 对话框样式覆盖 */
.el-dialog {
	background: var(--bg-secondary) !important;
	border: 1px solid var(--border-glow) !important;
	border-radius: 16px !important;
	box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 212, 255, 0.1) !important;
	
	.el-dialog__header {
		border-bottom: 1px solid var(--border-primary) !important;
		padding: 20px 24px !important;
	}
	
	.el-dialog__title {
		font-family: var(--font-display) !important;
		color: var(--accent-primary) !important;
		letter-spacing: 2px !important;
		text-transform: uppercase;
	}
	
	.el-dialog__body {
		padding: 24px !important;
	}
}

/* 分割线样式覆盖 */
.el-divider {
	border-color: var(--border-primary) !important;
}

/* 下拉菜单样式覆盖 */
.el-select-dropdown {
	background: var(--bg-secondary) !important;
	border: 1px solid var(--border-glow) !important;
	border-radius: 8px !important;
	
	.el-select-dropdown__item {
		font-family: var(--font-chinese) !important;
		color: var(--text-primary) !important;
		
		&:hover {
			background: rgba(0, 212, 255, 0.1) !important;
		}
		
		&.is-selected {
			color: var(--accent-primary) !important;
			font-weight: 600;
		}
	}
}

/* 标签样式覆盖 */
.el-form-item__label {
	font-family: var(--font-chinese) !important;
	color: var(--text-secondary) !important;
}

/* 动画关键帧 */
@keyframes pulse-glow {
	0%, 100% {
		box-shadow: 0 0 20px var(--element-ice-glow);
	}
	50% {
		box-shadow: 0 0 40px var(--element-ice-glow);
	}
}

@keyframes float {
	0%, 100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-5px);
	}
}

@keyframes scan-line {
	0% {
		transform: translateY(-100%);
	}
	100% {
		transform: translateY(100%);
	}
}

@keyframes border-flow {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

/* 元素颜色工具类 */
.element-fire { color: var(--element-fire); }
.element-ice { color: var(--element-ice); }
.element-thunder { color: var(--element-thunder); }
.element-poison { color: var(--element-poison); }
.element-dark { color: var(--element-dark); }
.element-light { color: var(--element-light); }
.element-blade { color: var(--element-blade); }

/* 元素发光工具类 */
.glow-fire { text-shadow: 0 0 10px var(--element-fire-glow); }
.glow-ice { text-shadow: 0 0 10px var(--element-ice-glow); }
.glow-thunder { text-shadow: 0 0 10px var(--element-thunder-glow); }
.glow-poison { text-shadow: 0 0 10px var(--element-poison-glow); }
.glow-dark { text-shadow: 0 0 10px var(--element-dark-glow); }
.glow-light { text-shadow: 0 0 10px var(--element-light-glow); }
.glow-blade { text-shadow: 0 0 10px var(--element-blade-glow); }
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