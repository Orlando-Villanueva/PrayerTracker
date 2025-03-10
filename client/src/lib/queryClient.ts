
import { QueryClient } from "@tanstack/react-query";

// Configure with your Laravel backend URL
const API_BASE_URL = "https://your-laravel-app-url.repl.co/api";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function apiRequest<T = any>(
  method: HttpMethod,
  endpoint: string,
  data?: any
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      // Laravel uses CSRF protection, you might need to include a token
      // "X-CSRF-TOKEN": csrfToken,
    },
    credentials: "include", // For cookies/session auth
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  
  // Handle non-2xx responses
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "An error occurred");
  }
  
  // For DELETE requests that might return empty responses
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}
