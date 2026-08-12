import 'reflect-metadata';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../../app.module';
import { buildOpenApiConfig } from '../../openapi.config';

async function main() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const document = SwaggerModule.createDocument(app, buildOpenApiConfig());
  const outputPath = resolve(
    __dirname,
    '../../../../packages/api-contract/openapi.json',
  );
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`);
  await app.close();
  process.stdout.write(`OpenAPI spec written to ${outputPath}\n`);
}

main().catch((err: unknown) => {
  process.stderr.write(
    `Failed to generate OpenAPI spec: ${
      err instanceof Error ? (err.stack ?? err.message) : String(err)
    }\n`,
  );
  process.exit(1);
});
