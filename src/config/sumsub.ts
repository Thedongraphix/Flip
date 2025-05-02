export const sumsubConfig = {
    baseUrl: 'https://api.sumsub.com',
    appToken: process.env.SUMSUB_APP_TOKEN || '',
    secretKey: process.env.SUMSUB_SECRET_KEY || '',
    defaultLevel: 'id-and-liveness',
    
    // Validation
    isConfigured(): boolean {
      return Boolean(this.appToken && this.secretKey);
    },
    
    validateConfig(): void {
      if (!this.isConfigured()) {
        throw new Error('SumSub API credentials not configured. Please check your environment variables.');
      }
    }
  };