import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Register global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Register the global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
