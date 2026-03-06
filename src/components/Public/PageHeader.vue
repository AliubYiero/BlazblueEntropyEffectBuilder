<style lang="scss" scoped>
.header {
	position: sticky;
	top: 0;
	z-index: 50;
	background: var(--background);
	border-bottom: 1px solid var(--border);
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

.logo-section {
	display: flex;
	align-items: center;
	gap: 12px;
}

.logo-text {
	font-family: var(--font-chinese);
	font-size: 16px;
	font-weight: 600;
	color: var(--foreground);
}

.logo-subtitle {
	font-family: var(--font-chinese);
	font-size: 12px;
	color: var(--muted-foreground);
}

.nav-menu {
	display: flex;
	gap: 4px;
}

.nav-item {
	padding: 8px 16px;
	font-family: var(--font-chinese);
	font-size: 14px;
	font-weight: 500;
	color: var(--muted-foreground);
	background: transparent;
	border: none;
	border-radius: calc(var(--radius) - 4px);
	cursor: pointer;
	transition: all 0.15s ease;
	
	&:hover {
		color: var(--foreground);
		background: hsl(from var(--accent) h s l / 0.5);
	}
	
	&.is-active {
		color: var(--foreground);
		background: var(--accent);
	}
}

.header-actions {
	display: flex;
	align-items: center;
	gap: 8px;
}

.theme-toggle {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	background: transparent;
	border: 1px solid var(--border);
	border-radius: calc(var(--radius) - 4px);
	cursor: pointer;
	transition: all 0.15s ease;
	
	&:hover {
		background: hsl(from var(--accent) h s l / 0.5);
		border-color: var(--ring);
	}
	
	svg {
		width: 18px;
		height: 18px;
		color: var(--foreground);
	}
}

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
			<div class="logo-section">
				<span class="logo-text">苍翼混沌效应</span>
				<span class="logo-subtitle">流派构建器</span>
			</div>
			
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
			
			<div class="header-actions">
				<button :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
				        class="theme-toggle"
				        @click="toggleTheme">
					<svg v-if="isDark" fill="none"
					     stroke="currentColor" stroke-linecap="round"
					     stroke-linejoin="round"
					     stroke-width="2" viewBox="0 0 24 24"
					     xmlns="http://www.w3.org/2000/svg">
						<circle cx="12" cy="12" r="5"></circle>
						<line x1="12" x2="12" y1="1" y2="3"></line>
						<line x1="12" x2="12" y1="21" y2="23"></line>
						<line x1="4.22" x2="5.64" y1="4.22" y2="5.64"></line>
						<line x1="18.36" x2="19.78" y1="18.36"
						      y2="19.78"></line>
						<line x1="1" x2="3" y1="12" y2="12"></line>
						<line x1="21" x2="23" y1="12" y2="12"></line>
						<line x1="4.22" x2="5.64" y1="19.78" y2="18.36"></line>
						<line x1="18.36" x2="19.78" y1="5.64" y2="4.22"></line>
					</svg>
					<svg v-else fill="none"
					     stroke="currentColor" stroke-linecap="round"
					     stroke-linejoin="round"
					     stroke-width="2" viewBox="0 0 24 24"
					     xmlns="http://www.w3.org/2000/svg">
						<path
							d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
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
	{ label: '流派构建', path: '/' },
	{ label: '双重词条', path: '/info' },
];

const currentPath = computed( () => router.currentRoute.value.path );
const { isDark, toggleTheme } = useTheme();

const handleNavigate = ( path: string ) => {
	router.push( path );
};
</script>
