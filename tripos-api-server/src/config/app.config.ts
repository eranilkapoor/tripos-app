export default () => ({
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.PORT || '4000', 10),
  shutdownDrainMs: parseInt(process.env.SHUTDOWN_DRAIN_MS || '5000', 10),
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
  cache: {
    driver: process.env.CACHE_DRIVER || 'local',
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      db: parseInt(process.env.REDIS_DB || '0', 10),
    },
  },
  storage: {
    driver: process.env.STORAGE_DRIVER || 'local',
    localRoot: process.env.STORAGE_LOCAL_ROOT || './storage',
    s3: {
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_S3_BUCKET,
      baseUrl: process.env.AWS_S3_BASE_URL,
    },
  },
  integrations: {
    email: {
      enabled: process.env.NOTIFICATION_EMAIL_ENABLED === 'true',
      provider: process.env.NOTIFICATION_EMAIL_PROVIDER || 'log',
      from: process.env.NOTIFICATION_EMAIL_FROM || 'support@tripos.local',
    },
    sms: {
      enabled: process.env.NOTIFICATION_SMS_ENABLED === 'true',
      provider: process.env.NOTIFICATION_SMS_PROVIDER || 'log',
    },
    whatsapp: {
      enabled: process.env.WHATSAPP_PROVIDER_ENABLED === 'true',
      provider: process.env.WHATSAPP_PROVIDER || 'log',
    },
    payments: {
      provider: process.env.PAYMENT_PROVIDER || 'log',
    },
    maps: {
      enabled: process.env.GOOGLE_MAPS_ENABLED === 'true',
      provider: 'google_maps',
    },
    ai: {
      enabled: process.env.AI_PROVIDER_ENABLED === 'true',
      provider: process.env.AI_PROVIDER || 'openai',
      model: process.env.AI_PROVIDER_MODEL,
    },
    monitoring: {
      enabled: process.env.MONITORING_ENABLED === 'true',
      provider: process.env.MONITORING_PROVIDER || 'log',
    },
  },
});
