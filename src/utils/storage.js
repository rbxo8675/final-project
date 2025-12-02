const STORAGE_KEY = 'startpage-settings';

// Default settings
export const defaultSettings = {
  // Page metadata
  pageTitle: 'My Start Page',
  pageIcon: '🏠', // Emoji icon for favicon

  // Theme settings
  theme: 'light',
  language: 'ko',

  // Widget style (glass, solid, minimal, neon, frosted)
  widgetStyle: 'glass',

  // UI settings
  uiSettings: {
    showControlsOnHover: true, // 설정 버튼 호버 시에만 표시
    controlsTimeout: 3000, // 마우스 멈춤 후 숨김 시간 (ms)
    editMode: false // 위젯 편집 모드
  },

  // Widget settings (legacy - for background only)
  widgets: {
    background: { enabled: true, category: 'nature' }
  },

  // Widget instances - each widget can have multiple instances
  widgetInstances: [
    { id: 'clock-1', type: 'clock', settings: { style: 'digital-large' } },
    { id: 'weather-1', type: 'weather', settings: {} },
    { id: 'quote-1', type: 'quote', settings: { type: 'bible' } }
  ],

  // Widget layout
  layout: [
    { i: 'clock-1', x: 4, y: 2, w: 4, h: 4, minW: 2, minH: 2 },
    { i: 'weather-1', x: 0, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'quote-1', x: 3, y: 6, w: 6, h: 2, minW: 3, minH: 2 }
  ],

  // Data
  bookmarks: [],
  todos: [],
  widgetData: {}, // Per-widget data storage (for todo, sticky, kanban, etc.)

  // Background favorites
  backgroundFavorites: [],
  currentBackground: null,
  backgroundMode: 'random', // 'random' | 'favorite'
  backgroundPosition: { x: 50, y: 50 }, // 0-100 percentage for object-position

  // API settings
  bibleTranslation: 'korean',
  weatherUnit: 'metric'
};

// Save settings to localStorage
export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
};

// Load settings from localStorage
export const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to ensure all keys exist
      return { ...defaultSettings, ...parsed };
    }
    return defaultSettings;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return defaultSettings;
  }
};

// Reset settings to default
export const resetSettings = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to reset settings:', error);
    return false;
  }
};

// Generate Theme Code (Base64 encoded settings)
export const generateThemeCode = (settings) => {
  try {
    return btoa(JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to generate theme code:', error);
    return null;
  }
};

// Parse Theme Code
export const parseThemeCode = (code) => {
  try {
    const decoded = atob(code);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to parse theme code:', error);
    return null;
  }
};
