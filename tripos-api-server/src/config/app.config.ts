export default () => ({
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.PORT || '4000', 10),
  api: {
    prefix: process.env.API_PREFIX || 'api',
    version: process.env.API_VERSION || 'v1',
    baseUrl: process.env.API_BASE_URL || 'http://localhost:4000',
  },
  cors: {
    origins: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:8081',
    ],
    maxAgeSeconds: parseInt(process.env.CORS_MAX_AGE_SECONDS || '86400', 10),
  },
});

