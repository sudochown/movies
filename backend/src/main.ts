import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Movies API')
    .setDescription('Movies API')
    .setVersion('1.0')
    .addTag('user')
    .addTag('movies')
    .addTag('movie')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  app.setGlobalPrefix('v1');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.enableCors();
  await app.listen(process.env.PORT);
}

bootstrap();
