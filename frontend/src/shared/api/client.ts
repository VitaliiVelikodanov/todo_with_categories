import axios from 'axios';

const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();

export const BASE_URL =
  configuredBaseUrl && configuredBaseUrl.length > 0
    ? configuredBaseUrl.replace(/\/$/, '')
    : '/backend';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.error;

    if (typeof responseMessage === 'string') {
      return responseMessage;
    }

    return error.message;
  }

  return error instanceof Error ? error.message : 'Unexpected request error';
}
