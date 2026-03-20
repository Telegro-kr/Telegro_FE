const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawApiBaseUrl) {
  throw new Error('VITE_API_BASE_URL is not defined.');
}

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '');
