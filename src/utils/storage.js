const STORAGE_KEY = 'startpage-settings';

// Default settings
export const defaultSettings = {
  // Theme settings
  theme: 'light',
  language: 'ko',

  // Widget settings
  widgets: {
    background: { enabled: true, category: 'nature' },
    clock: { enabled: true, style: 'digital-large' },
    weather: { enabled: true },
    quote: { enabled: true, type: 'bible' },
    bookmarks: { enabled: true },
    todoList: { enabled: true }
  },

  // Widget layout
  layout: [],

  // Data
  bookmarks: [],
  todos: [],

  // Background favorites
  backgroundFavorites: [],
  currentBackground: null,
  backgroundMode: 'random', // 'random' | 'favorite'

  // API settings
  bibleTranslation: 'korean',
  weatherUnit: 'metric'
};

// Maximum storage size for uploaded images (5MB)
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

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
