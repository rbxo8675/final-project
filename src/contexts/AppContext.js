import { createContext, useReducer, useEffect, useCallback, useState } from 'react';
import { loadSettings, saveSettings, defaultSettings } from '../utils/storage';

// Create Context
export const AppContext = createContext(null);

// Action Types
const ACTIONS = {
  SET_SETTINGS: 'SET_SETTINGS',
  UPDATE_THEME: 'UPDATE_THEME',
  UPDATE_LANGUAGE: 'UPDATE_LANGUAGE',
  UPDATE_WIDGET_STYLE: 'UPDATE_WIDGET_STYLE',
  UPDATE_UI_SETTINGS: 'UPDATE_UI_SETTINGS',
  UPDATE_WIDGET_SETTINGS: 'UPDATE_WIDGET_SETTINGS',
  UPDATE_LAYOUT: 'UPDATE_LAYOUT',
  ADD_WIDGET_INSTANCE: 'ADD_WIDGET_INSTANCE',
  REMOVE_WIDGET_INSTANCE: 'REMOVE_WIDGET_INSTANCE',
  UPDATE_WIDGET_INSTANCE: 'UPDATE_WIDGET_INSTANCE',
  // Widget data (for widgets that store their own data)
  SET_WIDGET_DATA: 'SET_WIDGET_DATA',
  UPDATE_WIDGET_DATA: 'UPDATE_WIDGET_DATA',
  DELETE_WIDGET_DATA: 'DELETE_WIDGET_DATA',
  ADD_BOOKMARK: 'ADD_BOOKMARK',
  REMOVE_BOOKMARK: 'REMOVE_BOOKMARK',
  UPDATE_BOOKMARK: 'UPDATE_BOOKMARK',
  REORDER_BOOKMARKS: 'REORDER_BOOKMARKS',
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  REMOVE_TODO: 'REMOVE_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  RESET_SETTINGS: 'RESET_SETTINGS',
  // Background favorites
  ADD_BACKGROUND_FAVORITE: 'ADD_BACKGROUND_FAVORITE',
  REMOVE_BACKGROUND_FAVORITE: 'REMOVE_BACKGROUND_FAVORITE',
  SET_CURRENT_BACKGROUND: 'SET_CURRENT_BACKGROUND',
  SET_BACKGROUND_MODE: 'SET_BACKGROUND_MODE',
  SET_BACKGROUND_POSITION: 'SET_BACKGROUND_POSITION',
  // Page metadata
  UPDATE_PAGE_TITLE: 'UPDATE_PAGE_TITLE',
  UPDATE_PAGE_ICON: 'UPDATE_PAGE_ICON'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_SETTINGS:
      return { ...state, ...action.payload };

    case ACTIONS.UPDATE_THEME:
      return { ...state, theme: action.payload };

    case ACTIONS.UPDATE_LANGUAGE:
      return { ...state, language: action.payload };

    case ACTIONS.UPDATE_WIDGET_STYLE:
      return { ...state, widgetStyle: action.payload };

    case ACTIONS.UPDATE_UI_SETTINGS:
      return {
        ...state,
        uiSettings: { ...state.uiSettings, ...action.payload }
      };

    case ACTIONS.UPDATE_WIDGET_SETTINGS:
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [action.payload.widgetName]: {
            ...state.widgets[action.payload.widgetName],
            ...action.payload.settings
          }
        }
      };

    case ACTIONS.UPDATE_LAYOUT:
      return { ...state, layout: action.payload };

    case ACTIONS.ADD_WIDGET_INSTANCE: {
      const { instance, layoutItem } = action.payload;
      return {
        ...state,
        widgetInstances: [...(state.widgetInstances || []), instance],
        layout: [...(state.layout || []), layoutItem]
      };
    }

    case ACTIONS.REMOVE_WIDGET_INSTANCE: {
      const instanceId = action.payload;
      // Also remove widget data if exists
      const newWidgetData = { ...(state.widgetData || {}) };
      delete newWidgetData[instanceId];
      return {
        ...state,
        widgetInstances: (state.widgetInstances || []).filter(w => w.id !== instanceId),
        layout: (state.layout || []).filter(l => l.i !== instanceId),
        widgetData: newWidgetData
      };
    }

    case ACTIONS.UPDATE_WIDGET_INSTANCE: {
      const { id, settings } = action.payload;
      return {
        ...state,
        widgetInstances: (state.widgetInstances || []).map(w =>
          w.id === id ? { ...w, settings: { ...w.settings, ...settings } } : w
        )
      };
    }

    // Widget data management (for todo, sticky, kanban, etc.)
    case ACTIONS.SET_WIDGET_DATA: {
      const { widgetId, data } = action.payload;
      return {
        ...state,
        widgetData: {
          ...(state.widgetData || {}),
          [widgetId]: data
        }
      };
    }

    case ACTIONS.UPDATE_WIDGET_DATA: {
      const { widgetId, data } = action.payload;
      return {
        ...state,
        widgetData: {
          ...(state.widgetData || {}),
          [widgetId]: {
            ...(state.widgetData?.[widgetId] || {}),
            ...data
          }
        }
      };
    }

    case ACTIONS.DELETE_WIDGET_DATA: {
      const widgetId = action.payload;
      const newWidgetData = { ...(state.widgetData || {}) };
      delete newWidgetData[widgetId];
      return {
        ...state,
        widgetData: newWidgetData
      };
    }

    case ACTIONS.ADD_BOOKMARK:
      return {
        ...state,
        bookmarks: [...state.bookmarks, { ...action.payload, id: Date.now() }]
      };

    case ACTIONS.REMOVE_BOOKMARK:
      return {
        ...state,
        bookmarks: state.bookmarks.filter((b) => b.id !== action.payload)
      };

    case ACTIONS.UPDATE_BOOKMARK:
      return {
        ...state,
        bookmarks: state.bookmarks.map((b) =>
          b.id === action.payload.id ? { ...b, ...action.payload.updates } : b
        )
      };

    case ACTIONS.REORDER_BOOKMARKS:
      return { ...state, bookmarks: action.payload };

    case ACTIONS.ADD_TODO:
      return {
        ...state,
        todos: [
          ...state.todos,
          { ...action.payload, id: Date.now(), completed: false }
        ]
      };

    case ACTIONS.TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t
        )
      };

    case ACTIONS.REMOVE_TODO:
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.payload)
      };

    case ACTIONS.UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        )
      };

    case ACTIONS.RESET_SETTINGS:
      return defaultSettings;

    // Background favorites
    case ACTIONS.ADD_BACKGROUND_FAVORITE:
      return {
        ...state,
        backgroundFavorites: [
          ...state.backgroundFavorites,
          { ...action.payload, id: Date.now().toString(), addedAt: Date.now() }
        ]
      };

    case ACTIONS.REMOVE_BACKGROUND_FAVORITE:
      return {
        ...state,
        backgroundFavorites: state.backgroundFavorites.filter(
          (f) => f.id !== action.payload
        ),
        // If removing current background, reset to random mode
        currentBackground:
          state.currentBackground?.id === action.payload
            ? null
            : state.currentBackground,
        backgroundMode:
          state.currentBackground?.id === action.payload
            ? 'random'
            : state.backgroundMode
      };

    case ACTIONS.SET_CURRENT_BACKGROUND:
      return {
        ...state,
        currentBackground: action.payload,
        backgroundMode: action.payload ? 'favorite' : 'random'
      };

    case ACTIONS.SET_BACKGROUND_MODE:
      return {
        ...state,
        backgroundMode: action.payload,
        currentBackground: action.payload === 'random' ? null : state.currentBackground
      };

    case ACTIONS.SET_BACKGROUND_POSITION:
      return {
        ...state,
        backgroundPosition: action.payload
      };

    case ACTIONS.UPDATE_PAGE_TITLE:
      return {
        ...state,
        pageTitle: action.payload
      };

    case ACTIONS.UPDATE_PAGE_ICON:
      return {
        ...state,
        pageIcon: action.payload
      };

    default:
      return state;
  }
};

// Provider Component
export const AppProvider = ({ children }) => {
  // Start with default settings
  const [state, dispatch] = useReducer(appReducer, defaultSettings);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from API on mount (async)
  useEffect(() => {
    const initializeSettings = async () => {
      setIsLoading(true);
      try {
        const settings = await loadSettings(); // Now async
        dispatch({ type: ACTIONS.SET_SETTINGS, payload: settings });
      } catch (error) {
        console.error('[AppContext] Failed to initialize settings:', error);
        // State already has defaultSettings
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    initializeSettings();
  }, []);

  // Save to localStorage and MockAPI whenever state changes (but not on initial load)
  useEffect(() => {
    if (isInitialized && !isLoading) {
      saveSettings(state);
    }
  }, [state, isInitialized, isLoading]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Update document title
  useEffect(() => {
    document.title = state.pageTitle || 'My Start Page';
  }, [state.pageTitle]);

  // Update favicon with emoji
  useEffect(() => {
    const emoji = state.pageIcon || '🏠';
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.font = '56px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 32, 36);

    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL();
    document.head.appendChild(link);
  }, [state.pageIcon]);

  // Action creators
  const updateTheme = useCallback((theme) => {
    dispatch({ type: ACTIONS.UPDATE_THEME, payload: theme });
  }, []);

  const updateLanguage = useCallback((language) => {
    dispatch({ type: ACTIONS.UPDATE_LANGUAGE, payload: language });
  }, []);

  const updateWidgetStyle = useCallback((style) => {
    dispatch({ type: ACTIONS.UPDATE_WIDGET_STYLE, payload: style });
  }, []);

  const updateUiSettings = useCallback((settings) => {
    dispatch({ type: ACTIONS.UPDATE_UI_SETTINGS, payload: settings });
  }, []);

  const updateWidgetSettings = useCallback((widgetName, settings) => {
    dispatch({
      type: ACTIONS.UPDATE_WIDGET_SETTINGS,
      payload: { widgetName, settings }
    });
  }, []);

  const updateLayout = useCallback((layout) => {
    dispatch({ type: ACTIONS.UPDATE_LAYOUT, payload: layout });
  }, []);

  const addWidgetInstance = useCallback((type, settings = {}) => {
    const id = `${type}-${Date.now()}`;
    const instance = { id, type, settings };

    // Default layout positions for new widgets
    const layoutDefaults = {
      clock: { w: 4, h: 4, minW: 2, minH: 2 },
      weather: { w: 3, h: 4, minW: 2, minH: 3 },
      quote: { w: 6, h: 2, minW: 3, minH: 2 },
      bookmarks: { w: 4, h: 4, minW: 2, minH: 2 },
      todo: { w: 3, h: 4, minW: 2, minH: 3 },
      sticky: { w: 3, h: 3, minW: 2, minH: 2 },
      kanban: { w: 6, h: 4, minW: 4, minH: 3 }
    };

    const defaults = layoutDefaults[type] || { w: 2, h: 2, minW: 2, minH: 2 };
    const layoutItem = {
      i: id,
      x: 0,
      y: Infinity, // Place at bottom
      ...defaults
    };

    dispatch({
      type: ACTIONS.ADD_WIDGET_INSTANCE,
      payload: { instance, layoutItem }
    });

    return id;
  }, []);

  const removeWidgetInstance = useCallback((id) => {
    dispatch({ type: ACTIONS.REMOVE_WIDGET_INSTANCE, payload: id });
  }, []);

  const updateWidgetInstance = useCallback((id, settings) => {
    dispatch({
      type: ACTIONS.UPDATE_WIDGET_INSTANCE,
      payload: { id, settings }
    });
  }, []);

  // Widget data management
  const setWidgetData = useCallback((widgetId, data) => {
    dispatch({
      type: ACTIONS.SET_WIDGET_DATA,
      payload: { widgetId, data }
    });
  }, []);

  const updateWidgetData = useCallback((widgetId, data) => {
    dispatch({
      type: ACTIONS.UPDATE_WIDGET_DATA,
      payload: { widgetId, data }
    });
  }, []);

  const getWidgetData = useCallback((widgetId) => {
    return state.widgetData?.[widgetId] || null;
  }, [state.widgetData]);

  const addBookmark = useCallback((bookmark) => {
    dispatch({ type: ACTIONS.ADD_BOOKMARK, payload: bookmark });
  }, []);

  const removeBookmark = useCallback((id) => {
    dispatch({ type: ACTIONS.REMOVE_BOOKMARK, payload: id });
  }, []);

  const updateBookmark = useCallback((id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_BOOKMARK, payload: { id, updates } });
  }, []);

  const reorderBookmarks = useCallback((bookmarks) => {
    dispatch({ type: ACTIONS.REORDER_BOOKMARKS, payload: bookmarks });
  }, []);

  const addTodo = useCallback((todo) => {
    dispatch({ type: ACTIONS.ADD_TODO, payload: todo });
  }, []);

  const toggleTodo = useCallback((id) => {
    dispatch({ type: ACTIONS.TOGGLE_TODO, payload: id });
  }, []);

  const removeTodo = useCallback((id) => {
    dispatch({ type: ACTIONS.REMOVE_TODO, payload: id });
  }, []);

  const updateTodo = useCallback((id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_TODO, payload: { id, updates } });
  }, []);

  const resetSettings = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_SETTINGS });
  }, []);

  // Background favorites actions
  const addBackgroundFavorite = useCallback((favorite) => {
    dispatch({ type: ACTIONS.ADD_BACKGROUND_FAVORITE, payload: favorite });
  }, []);

  const removeBackgroundFavorite = useCallback((id) => {
    dispatch({ type: ACTIONS.REMOVE_BACKGROUND_FAVORITE, payload: id });
  }, []);

  const setCurrentBackground = useCallback((background) => {
    dispatch({ type: ACTIONS.SET_CURRENT_BACKGROUND, payload: background });
  }, []);

  const setBackgroundMode = useCallback((mode) => {
    dispatch({ type: ACTIONS.SET_BACKGROUND_MODE, payload: mode });
  }, []);

  const setBackgroundPosition = useCallback((position) => {
    dispatch({ type: ACTIONS.SET_BACKGROUND_POSITION, payload: position });
  }, []);

  // Page metadata actions
  const updatePageTitle = useCallback((title) => {
    dispatch({ type: ACTIONS.UPDATE_PAGE_TITLE, payload: title });
  }, []);

  const updatePageIcon = useCallback((icon) => {
    dispatch({ type: ACTIONS.UPDATE_PAGE_ICON, payload: icon });
  }, []);

  // Check if an image is in favorites
  const isBackgroundFavorited = useCallback(
    (imageId) => {
      return state.backgroundFavorites.some((f) => f.originalId === imageId);
    },
    [state.backgroundFavorites]
  );

  const value = {
    ...state,
    isLoading, // Expose loading state
    updateTheme,
    updateLanguage,
    updateWidgetStyle,
    updateUiSettings,
    updateWidgetSettings,
    updateLayout,
    addWidgetInstance,
    removeWidgetInstance,
    updateWidgetInstance,
    // Widget data
    setWidgetData,
    updateWidgetData,
    getWidgetData,
    addBookmark,
    removeBookmark,
    updateBookmark,
    reorderBookmarks,
    addTodo,
    toggleTodo,
    removeTodo,
    updateTodo,
    resetSettings,
    // Background favorites
    addBackgroundFavorite,
    removeBackgroundFavorite,
    setCurrentBackground,
    setBackgroundMode,
    setBackgroundPosition,
    isBackgroundFavorited,
    // Page metadata
    updatePageTitle,
    updatePageIcon
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
