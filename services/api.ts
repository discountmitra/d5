// Base API client configuration
export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

// Generic API client
export class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const requestOptions: RequestInit = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        ...options.headers,
      },
      ...(options.body && { body: JSON.stringify(options.body) }),
    };

    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  async delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Mock API client for development (will be replaced with Supabase)
export class MockApiClient extends ApiClient {
  constructor() {
    super({
      baseUrl: 'https://mock-api.com',
      apiKey: 'mock-key',
    });
  }

  // Override methods to return mock data
  async get<T>(endpoint: string): Promise<T> {
    // Return mock data based on endpoint
    return this.getMockData<T>(endpoint);
  }

  private getMockData<T>(endpoint: string): T {
    // This will be replaced with actual Supabase calls
    return {} as T;
  }
}

// Singleton instance
let apiClient: ApiClient | null = null;

export function getApiClient(): ApiClient {
  if (!apiClient) {
    // In development, use mock client
    // In production, this will be replaced with Supabase client
    apiClient = new MockApiClient();
  }
  return apiClient;
}

export function setApiClient(client: ApiClient): void {
  apiClient = client;
}
