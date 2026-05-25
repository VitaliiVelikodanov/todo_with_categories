import axios from 'axios';

export const BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

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
