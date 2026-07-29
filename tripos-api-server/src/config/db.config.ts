export default () => ({
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/tripos',
    retryAttempts: parseInt(process.env.MONGO_RETRY_ATTEMPTS || '5', 10),
    retryDelay: parseInt(process.env.MONGO_RETRY_DELAY || '5000', 10),
    maxPoolSize: parseInt(process.env.MONGO_MAX_POOL_SIZE || '50', 10),
    minPoolSize: parseInt(process.env.MONGO_MIN_POOL_SIZE || '0', 10),
    serverSelectionTimeoutMs: parseInt(
      process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || '10000',
      10,
    ),
    socketTimeoutMs: parseInt(
      process.env.MONGO_SOCKET_TIMEOUT_MS || '45000',
      10,
    ),
    autoIndex:
      process.env.MONGO_AUTO_INDEX !== undefined
        ? process.env.MONGO_AUTO_INDEX === 'true'
        : !['staging', 'production'].includes(
            process.env.NODE_ENV ?? 'development',
          ),
  },
});

