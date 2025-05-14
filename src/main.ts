import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const logger = new Logger();
  logger.log(`Server running on http://localhost:${process.env.PORT ?? 3000}`);
  
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const firstError = Object.values(errors[0].constraints)[0]; // Pega apenas a primeira mensagem de erro
        return new BadRequestException(firstError);
      },
    }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
