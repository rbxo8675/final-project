import { fetchSettingsFromApi, updateSettingsToApi } from '../services/settingsApi';

const STORAGE_KEY = 'startpage-settings';

// Sync status tracking
let syncStatus = {
  status: 'idle', // 'idle' | 'loading' | 'syncing' | 'error'
  lastSync: null,
  error: null
};

// Debounce timeout for saveSettings
let saveTimeout = null;
const SAVE_DEBOUNCE = 1000; // 1 second

// Get current sync status
export const getSyncStatus = () => ({ ...syncStatus });

// Update sync status and notify listeners
const updateSyncStatus = (updates) => {
  syncStatus = { ...syncStatus, ...updates };
  console.log('[Sync Status]', syncStatus);
};

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

  // Widget layout (12 cols x 8 rows grid)
  layout: [
    { i: 'clock-1', x: 4, y: 2, w: 4, h: 3 },
    { i: 'weather-1', x: 0, y: 0, w: 3, h: 3 },
    { i: 'quote-1', x: 3, y: 5, w: 6, h: 2 }
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

// Save settings to both localStorage (immediate) and MockAPI (debounced)
export const saveSettings = (settings) => {
  // Always save to localStorage immediately (cache layer)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    console.log('[Storage] Saved to localStorage (cache)');
  } catch (error) {
    console.error('[Storage] Failed to save to localStorage:', error);
  }

  // Debounced save to MockAPI
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(async () => {
    // Check if online (optional, MockAPI call will fail gracefully)
    if (!navigator.onLine) {
      console.log('[Storage] Offline - skipping MockAPI sync');
      updateSyncStatus({
        status: 'error',
        error: 'Offline - changes saved locally'
      });
      return;
    }

    updateSyncStatus({ status: 'syncing' });

    try {
      await updateSettingsToApi(settings);
      updateSyncStatus({
        status: 'idle',
        lastSync: Date.now(),
        error: null
      });
      console.log('[Storage] Synced to MockAPI');
    } catch (error) {
      console.error('[Storage] Failed to sync to MockAPI:', error.message);
      updateSyncStatus({
        status: 'error',
        error: `Sync failed: ${error.message}`
      });
      // Data is still safe in localStorage
    }
  }, SAVE_DEBOUNCE);

  return true;
};

// Load settings from MockAPI (with localStorage fallback)
export const loadSettings = async () => {
  updateSyncStatus({ status: 'loading', error: null });

  // Get local settings first (for fallback and migration)
  let localSettings = null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      localSettings = JSON.parse(saved);
    }
  } catch (error) {
    console.error('[Storage] Failed to read localStorage:', error);
  }

  // Try to fetch from MockAPI
  try {
    const apiSettings = await fetchSettingsFromApi();

    // If API returned null (not configured), use localStorage
    if (apiSettings === null) {
      console.log('[Storage] MockAPI not configured, using localStorage');
      updateSyncStatus({ status: 'idle' });
      return { ...defaultSettings, ...localSettings };
    }

    // Merge API settings with defaults
    const merged = { ...defaultSettings, ...apiSettings };

    // Update localStorage cache
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (error) {
      console.error('[Storage] Failed to cache to localStorage:', error);
    }

    updateSyncStatus({
      status: 'idle',
      lastSync: Date.now(),
      error: null
    });

    console.log('[Storage] Settings loaded from MockAPI');
    return merged;
  } catch (error) {
    console.warn('[Storage] Failed to load from MockAPI, using localStorage:', error.message);

    // Fallback to localStorage
    if (localSettings) {
      const merged = { ...defaultSettings, ...localSettings };
      updateSyncStatus({
        status: 'error',
        error: `API error: ${error.message}`
      });
      console.log('[Storage] Settings loaded from localStorage (fallback)');
      return merged;
    }

    // Last resort: return defaults
    updateSyncStatus({
      status: 'error',
      error: 'Failed to load settings from any source'
    });

    console.log('[Storage] Using default settings');
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
