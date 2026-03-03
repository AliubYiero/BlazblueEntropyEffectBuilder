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
