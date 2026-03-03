/**
 * useTheme.ts
 * created by 2026/3/3
 * @file 主题管理 Composable
 * @author Yiero
 * */

import { ref, watch, onMounted, onScopeDispose } from 'vue';

const THEME_KEY = 'theme-preference';

export function useTheme() {
	// 移入函数内部，避免模块级状态共享
	const isDark = ref<boolean>(false);

	/**
	 * 获取存储的主题偏好
	 */
	const getStoredTheme = (): 'light' | 'dark' | null => {
		if ( typeof window === 'undefined' ) return null;
		try {
			return localStorage.getItem( THEME_KEY ) as 'light' | 'dark' | null;
		} catch {
			return null;
		}
	};

	/**
	 * 存储主题偏好
	 */
	const setStoredTheme = ( theme: 'light' | 'dark' ): void => {
		if ( typeof window === 'undefined' ) return;
		try {
			localStorage.setItem( THEME_KEY, theme );
		} catch {
			// localStorage 不可用时静默失败
		}
	};

	/**
	 * 获取系统主题偏好
	 */
	const getSystemTheme = (): 'light' | 'dark' => {
		if ( typeof window === 'undefined' ) return 'light';
		return window.matchMedia( '(prefers-color-scheme: dark)' ).matches ? 'dark' : 'light';
	};

	/**
	 * 应用主题到 DOM
	 */
	const applyTheme = ( dark: boolean ): void => {
		if ( typeof document === 'undefined' ) return;

		const html = document.documentElement;
		if ( dark ) {
			html.classList.add( 'dark' );
		} else {
			html.classList.remove( 'dark' );
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
		if ( stored ) {
			isDark.value = stored === 'dark';
		} else {
			isDark.value = getSystemTheme() === 'dark';
		}
	};

	/**
	 * 监听系统主题变化
	 */
	const listenSystemTheme = (): (() => void) | null => {
		if ( typeof window === 'undefined' ) return null;
		
		const mediaQuery = window.matchMedia( '(prefers-color-scheme: dark)' );
		const handler = ( e: MediaQueryListEvent ): void => {
			if ( !getStoredTheme() ) {
				isDark.value = e.matches;
			}
		};
		mediaQuery.addEventListener( 'change', handler );
		return () => mediaQuery.removeEventListener( 'change', handler );
	};

	// 在组件作用域内创建 watcher
	const stopWatch = watch( isDark, ( value ) => {
		applyTheme( value );
		setStoredTheme( value ? 'dark' : 'light' );
	} );

	let cleanupSystemListener: ( () => void ) | null = null;

	onMounted( () => {
		initTheme();
		applyTheme( isDark.value );
		cleanupSystemListener = listenSystemTheme();
	} );

	onScopeDispose( () => {
		stopWatch();
		cleanupSystemListener?.();
	} );

	return {
		isDark,
		toggleTheme,
	};
}