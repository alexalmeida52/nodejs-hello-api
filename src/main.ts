import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose']
  });

  const config = new DocumentBuilder()
    .setTitle('Hello API')
    .setDescription('API REST com NestJS - Documentação Swagger')
    .setVersion('1.0')
    .addTag('hello')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Swagger documentation: ${await app.getUrl()}/api/docs`);
}
bootstrap();
