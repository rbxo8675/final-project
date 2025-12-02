import { createContext, useReducer, useEffect, useCallback } from 'react';
import { loadSettings, saveSettings, defaultSettings } from '../utils/storage';

// Create Context
export const AppContext = createContext(null);

// Action Types
const ACTIONS = {
  SET_SETTINGS: 'SET_SETTINGS',
  UPDATE_THEME: 'UPDATE_THEME',
  UPDATE_LANGUAGE: 'UPDATE_LANGUAGE',
  UPDATE_WIDGET_SETTINGS: 'UPDATE_WIDGET_SETTINGS',
  UPDATE_LAYOUT: 'UPDATE_LAYOUT',
  ADD_BOOKMARK: 'ADD_BOOKMARK',
  REMOVE_BOOKMARK: 'REMOVE_BOOKMARK',
  UPDATE_BOOKMARK: 'UPDATE_BOOKMARK',
  REORDER_BOOKMARKS: 'REORDER_BOOKMARKS',
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  REMOVE_TODO: 'REMOVE_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  RESET_SETTINGS: 'RESET_SETTINGS'
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

    default:
      return state;
  }
};

// Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = loadSettings();
    dispatch({ type: ACTIONS.SET_SETTINGS, payload: savedSettings });
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveSettings(state);
  }, [state]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Action creators
  const updateTheme = useCallback((theme) => {
    dispatch({ type: ACTIONS.UPDATE_THEME, payload: theme });
  }, []);

  const updateLanguage = useCallback((language) => {
    dispatch({ type: ACTIONS.UPDATE_LANGUAGE, payload: language });
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

  const value = {
    ...state,
    updateTheme,
    updateLanguage,
    updateWidgetSettings,
    updateLayout,
    addBookmark,
    removeBookmark,
    updateBookmark,
    reorderBookmarks,
    addTodo,
    toggleTodo,
    removeTodo,
    updateTodo,
    resetSettings
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
