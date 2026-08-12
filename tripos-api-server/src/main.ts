import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { buildOpenApiConfig } from './openapi.config';

const SHUTDOWN_TIMEOUT_MS = 10_000;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function shutdown(
  signal: string,
  app: Awaited<ReturnType<typeof NestFactory.create>>,
  logger: Logger,
): Promise<void> {
  const appService = app.get(AppService, { strict: false });
  const configService = app.get(ConfigService);
  const drainMs = configService.get<number>('shutdownDrainMs') ?? 5000;

  logger.log(`Received ${signal} - starting graceful shutdown`);
  appService.markShuttingDown();
  logger.log(`Readiness disabled; draining traffic for ${drainMs}ms`);

  if (drainMs > 0) {
    await sleep(drainMs);
  }

  const forceExit = setTimeout(() => {
    logger.error('Graceful shutdown timed out - forcing exit');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  forceExit.unref();

  try {
    await app.close();
    clearTimeout(forceExit);
    logger.log('Graceful shutdown complete');
    process.exit(0);
  } catch (err: unknown) {
    logger.error(
      'Error during shutdown',
      err instanceof Error ? err.stack : String(err),
    );
    process.exit(1);
  }
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('api.prefix') ?? 'api';
  const apiVersion = configService.get<string>('api.version') ?? 'v1';
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);
  app.enableCors({
    origin: configService.get<string[]>('cors.origins'),
    maxAge: configService.get<number>('cors.maxAgeSeconds'),
  });
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, buildOpenApiConfig());
  SwaggerModule.setup('api/docs', app, document);

  const shutdownSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  for (const signal of shutdownSignals) {
    process.once(signal, () => {
      void shutdown(signal, app, logger);
    });
  }

  await app.listen(configService.get<number>('port') ?? 4000);
}

bootstrap().catch((err: unknown) => {
  process.stderr.write(
    `Application failed to start: ${
      err instanceof Error ? (err.stack ?? err.message) : String(err)
    }\n`,
  );
  process.exit(1);
});
