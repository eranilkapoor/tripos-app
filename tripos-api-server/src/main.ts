import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>("api.prefix") ?? "api";
  const apiVersion = configService.get<string>("api.version") ?? "v1";
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);
  app.enableCors({
    origin: configService.get<string[]>("cors.origins"),
    maxAge: configService.get<number>("cors.maxAgeSeconds"),
  });
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("TripOS API")
    .setDescription("Travel CRM, quotation, booking, operations, B2B, and finance MVP API.")
    .setVersion("0.1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(configService.get<number>("port") ?? 4000);
}

void bootstrap();
