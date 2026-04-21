import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Security & Performance Hardening
  app.use(helmet());
  app.use(compression());
  app.enableCors(); // Needed for potential future web dashboard or cross-origin tentacles

  // 2. Global API Configuration
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // 3. Graceful Shutdown (Critical for Cloud Run)
  app.enableShutdownHooks();

  // 4. Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 5. Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 6. API Documentation (Swagger)
  const config = new DocumentBuilder()
    .setTitle('FinWealth App API')
    .setDescription(
      'The core financial engine for the Elite Edition of FinWealth.',
    )
    .setVersion('1.0')
    .addBearerAuth() // Support for JWT authentication in Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(
    `🚀 FinWealth Backend is running on: http://localhost:${port}/api/v1`,
  );
  console.log(
    `📄 API Documentation available at: http://localhost:${port}/api/docs`,
  );
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start application:', err);
  process.exit(1);
});
