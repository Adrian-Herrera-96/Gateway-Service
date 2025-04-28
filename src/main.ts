import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FrontEnvs, PortEnvs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Microservice-Gateway');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: FrontEnvs.frontendServers,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Añadir OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization', 'credentials'],
    credentials: true, // Si estás utilizando cookies o encabezados de autenticación
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  logger.log(`Gateway running on port ${PortEnvs.port}`);

  //Configuración swagger (Documentación de las APIS)
  const config = new DocumentBuilder()
    .setTitle('APIS DOCUMENTATION')
    .setDescription('Documentation of the Muserpol Microservices APIs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PortEnvs.port);
}
bootstrap();
