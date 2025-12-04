// MockAPI Settings API Service
// Handles all communication with MockAPI backend for settings persistence

const MOCKAPI_URL = process.env.REACT_APP_MOCKAPI_URL;
const SETTINGS_ID = '1'; // Fixed ID for single settings object
const TIMEOUT = 10000; // 10 second timeout

/**
 * Fetch settings from MockAPI
 * @returns {Promise<Object>} Settings object
 * @throws {Error} Network, API, or timeout errors
 */
export const fetchSettingsFromApi = async () => {
  // If MockAPI URL not configured, return null (triggers localStorage fallback)
  if (!MOCKAPI_URL) {
    console.warn('MockAPI URL not configured. Using localStorage-only mode.');
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(
      `${MOCKAPI_URL}/settings/${SETTINGS_ID}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      const error = new Error(`API error: ${response.status} ${response.statusText}`);
      error.type = 'API_ERROR';
      error.status = response.status;
      throw error;
    }

    const result = await response.json();

    // MockAPI stores the entire settings object in a 'data' field
    // If the structure is different, adjust accordingly
    return result.data || result;
  } catch (error) {
    clearTimeout(timeout);

    // Handle abort (timeout)
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Request timeout');
      timeoutError.type = 'TIMEOUT_ERROR';
      throw timeoutError;
    }

    // Add error type if not already set
    if (!error.type) {
      error.type = 'NETWORK_ERROR';
    }

    throw error;
  }
};

/**
 * Update settings to MockAPI
 * @param {Object} settings - Complete settings object
 * @returns {Promise<Object>} Updated settings object
 * @throws {Error} Network, API, or timeout errors
 */
export const updateSettingsToApi = async (settings) => {
  // If MockAPI URL not configured, silently skip (localStorage already saved)
  if (!MOCKAPI_URL) {
    console.warn('MockAPI URL not configured. Skipping API sync.');
    return settings;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(
      `${MOCKAPI_URL}/settings/${SETTINGS_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: settings // Wrap settings in 'data' field for MockAPI
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      const error = new Error(`API error: ${response.status} ${response.statusText}`);
      error.type = 'API_ERROR';
      error.status = response.status;
      throw error;
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    clearTimeout(timeout);

    // Handle abort (timeout)
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Request timeout');
      timeoutError.type = 'TIMEOUT_ERROR';
      throw timeoutError;
    }

    // Add error type if not already set
    if (!error.type) {
      error.type = 'NETWORK_ERROR';
    }

    throw error;
  }
};

/**
 * Retry wrapper with exponential backoff
 * @param {Function} fetchFn - Async function to retry
 * @param {number} retries - Number of retry attempts (default: 3)
 * @param {number} delay - Initial delay in ms (default: 1000)
 * @returns {Promise<any>} Result of fetchFn
 */
export const fetchWithRetry = async (fetchFn, retries = 3, delay = 1000) => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchFn();
    } catch (error) {
      lastError = error;

      // Don't retry on certain errors
      if (error.type === 'API_ERROR' && error.status === 404) {
        throw error; // Settings not found, don't retry
      }

      // If we have retries left, wait and try again
      if (attempt < retries) {
        const waitTime = delay * Math.pow(2, attempt); // Exponential backoff
        console.log(`Retry attempt ${attempt + 1}/${retries} after ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // All retries exhausted
  throw lastError;
};
