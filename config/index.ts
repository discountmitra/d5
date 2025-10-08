// Environment configuration
export interface AppConfig {
  // Supabase configuration
  supabaseUrl: string;
  supabaseAnonKey: string;
  
  // Twilio configuration
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioFromNumber?: string;
  
  // Google Maps configuration
  googleMapsApiKey?: string;
  
  // App configuration
  environment: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  enableLogging: boolean;
}

// Default configuration
const defaultConfig: AppConfig = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  twilioAccountSid: process.env.EXPO_PUBLIC_TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.EXPO_PUBLIC_TWILIO_AUTH_TOKEN,
  twilioFromNumber: process.env.EXPO_PUBLIC_TWILIO_FROM_NUMBER,
  googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  environment: (process.env.EXPO_PUBLIC_ENVIRONMENT as any) || 'development',
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.discountmithra.com',
  enableLogging: process.env.EXPO_PUBLIC_ENABLE_LOGGING === 'true',
};

// Validate required configuration
export function validateConfig(config: AppConfig): void {
  const requiredFields: (keyof AppConfig)[] = ['supabaseUrl', 'supabaseAnonKey'];
  
  for (const field of requiredFields) {
    if (!config[field]) {
      throw new Error(`Missing required configuration: ${field}`);
    }
  }
}

// Export validated configuration
let config: AppConfig;

try {
  validateConfig(defaultConfig);
  config = defaultConfig;
} catch (error) {
  console.warn('Configuration validation failed:', error);
  config = defaultConfig;
}

export { config };

// Helper functions
export function isDevelopment(): boolean {
  return config.environment === 'development';
}

export function isProduction(): boolean {
  return config.environment === 'production';
}

export function getApiUrl(endpoint: string): string {
  return `${config.apiBaseUrl}${endpoint}`;
}
