import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join, resolve } from 'path';
import * as express from 'express';
import { BadRequestException, Logger, ValidationError, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  const logger = new Logger();
  logger.log(
    `Server running on http://localhost:${process.env.PORT ?? 3000}`,
    'Bootstrap',
  );
  logger.log(
    `Documentation running on http://localhost:${process.env.PORT ?? 3000}/api-docs`,
    'Bootstrap',
  );

  const config = new DocumentBuilder()
    .setTitle('Elos API')
    .setDescription('Documentação da API para o front-end do sistema ELOS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const firstError = findFirstConstraint(errors);
        return new BadRequestException(firstError);
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

// Pega apenas a primeira mensagem de erro
function findFirstConstraint(errors: ValidationError[]): string {
  for (const error of errors) {
    if (error.constraints && Object.values(error.constraints).length > 0) {
      return Object.values(error.constraints)[0];
    }

    if (error.children && error.children.length > 0) {
      const msg = findFirstConstraint(error.children);
      if (msg) {
        return msg;
      }
    }
  }
}

bootstrap();
