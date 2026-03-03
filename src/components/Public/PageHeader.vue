<style lang="scss" scoped>
/* ============================================
   导航栏 - 赛博朋克风格
   ============================================ */

.header {
	position: sticky;
	top: 0;
	z-index: 1000;
	background: linear-gradient(180deg, rgba(10, 10, 15, 0.98) 0%, rgba(10, 10, 15, 0.9) 100%);
	backdrop-filter: blur(20px);
	border-bottom: 1px solid var(--border-primary);
	
	/* 扫描线效果 */
	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, 
			transparent 0%, 
			var(--accent-primary) 50%, 
			transparent 100%);
		opacity: 0.5;
	}
}

.header-inner {
	max-width: 1600px;
	margin: 0 auto;
	padding: 0 32px;
	height: 72px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

/* Logo 区域 */
.logo-section {
	display: flex;
	align-items: center;
	gap: 16px;
}

.logo-icon {
	width: 48px;
	height: 48px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	
	/* 六边形背景 */
	&::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
		clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
		opacity: 0.9;
		animation: pulse-glow 3s ease-in-out infinite;
	}
	
	/* 内部图案 */
	&::after {
		content: '';
		position: absolute;
		inset: 6px;
		background: var(--bg-primary);
		clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
	}
}

.logo-text {
	font-family: var(--font-display);
	font-size: 14px;
	font-weight: 700;
	letter-spacing: 3px;
	text-transform: uppercase;
	background: linear-gradient(135deg, var(--accent-primary) 0%, #fff 50%, var(--accent-secondary) 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.logo-subtitle {
	font-family: var(--font-chinese);
	font-size: 10px;
	color: var(--text-muted);
	letter-spacing: 4px;
	margin-top: 2px;
}

/* 导航菜单 */
.nav-menu {
	display: flex;
	gap: 8px;
	padding: 4px;
	background: rgba(0, 0, 0, 0.3);
	border-radius: 12px;
	border: 1px solid var(--border-primary);
}

.nav-item {
	position: relative;
	padding: 12px 24px;
	font-family: var(--font-display);
	font-size: 13px;
	font-weight: 600;
	letter-spacing: 2px;
	text-transform: uppercase;
	color: var(--text-secondary);
	background: transparent;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	transition: all var(--transition-normal);
	overflow: hidden;
	
	/* Hover 背景光效 */
	&::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, 
			rgba(0, 212, 255, 0.1) 0%, 
			rgba(255, 61, 61, 0.1) 100%);
		opacity: 0;
		transition: opacity var(--transition-normal);
	}
	
	/* 底部指示线 */
	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 2px;
		background: var(--accent-primary);
		transition: width var(--transition-normal);
		box-shadow: 0 0 10px var(--element-ice-glow);
	}
	
	&:hover {
		color: var(--text-primary);
		
		&::before {
			opacity: 1;
		}
		
		&::after {
			width: 60%;
		}
	}
	
	/* 激活状态 */
	&.is-active {
		color: var(--accent-primary);
		background: rgba(0, 212, 255, 0.1);
		
		&::after {
			width: 80%;
			background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
		}
		
		/* 角落装饰 */
		.corner {
			position: absolute;
			width: 8px;
			height: 8px;
			border: 1px solid var(--accent-primary);
			
			&--tl {
				top: 4px;
				left: 4px;
				border-right: none;
				border-bottom: none;
			}
			
			&--tr {
				top: 4px;
				right: 4px;
				border-left: none;
				border-bottom: none;
			}
			
			&--bl {
				bottom: 4px;
				left: 4px;
				border-right: none;
				border-top: none;
			}
			
			&--br {
				bottom: 4px;
				right: 4px;
				border-left: none;
				border-top: none;
			}
		}
	}
	
	.nav-label {
		position: relative;
		z-index: 1;
	}
}

/* 右侧装饰 */
.header-decoration {
	display: flex;
	align-items: center;
	gap: 16px;
}

.decoration-line {
	width: 100px;
	height: 1px;
	background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
	opacity: 0.5;
}

.decoration-dot {
	width: 8px;
	height: 8px;
	background: var(--accent-primary);
	border-radius: 50%;
	animation: pulse-glow 2s ease-in-out infinite;
}

/* 响应式 */
@media (max-width: 768px) {
	.header-inner {
		padding: 0 16px;
		height: 64px;
	}
	
	.logo-text {
		font-size: 12px;
		letter-spacing: 2px;
	}
	
	.logo-subtitle {
		display: none;
	}
	
	.nav-item {
		padding: 10px 16px;
		font-size: 11px;
	}
	
	.header-decoration {
		display: none;
	}
}
</style>

<template>
	<header class="header">
		<div class="header-inner">
			<!-- Logo 区域 -->
			<div class="logo-section">
				<div class="logo-icon"></div>
				<div class="logo-container">
					<div class="logo-text">Entropy Effect</div>
					<div class="logo-subtitle">流派构建器</div>
				</div>
			</div>
			
			<!-- 导航菜单 -->
			<nav class="nav-menu">
				<button
					v-for="item in navItems"
					:key="item.path"
					:class="['nav-item', { 'is-active': currentPath === item.path }]"
					@click="handleNavigate(item.path)"
				>
					<span class="nav-label">{{ item.label }}</span>
					<template v-if="currentPath === item.path">
						<span class="corner corner--tl"></span>
						<span class="corner corner--tr"></span>
						<span class="corner corner--bl"></span>
						<span class="corner corner--br"></span>
					</template>
				</button>
			</nav>
			
			<!-- 右侧装饰 -->
			<div class="header-decoration">
				<div class="decoration-line"></div>
				<div class="decoration-dot"></div>
			</div>
		</div>
	</header>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { router } from '../../router';

interface NavItem {
	label: string;
	path: string;
}

const navItems: NavItem[] = [
	{ label: '双重词条', path: '/' },
	{ label: '流派构建', path: '/builder' },
];

const currentPath = computed(() => router.currentRoute.value.path);

const handleNavigate = (path: string) => {
	router.push(path);
};
</script>