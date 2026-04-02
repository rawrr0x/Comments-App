import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'CommentsApp',
    }),
  });
  const PORT = process.env.PORT || 5000;

  const config = new DocumentBuilder()
    .setTitle('Comments App')
    .setDescription('Comments App API documnetation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => Logger.log(`Server started on ${PORT}`));
}

bootstrap();
