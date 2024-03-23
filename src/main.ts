import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UtilsService } from './utils/utils.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      name: 'session_id',
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );
  const options = new DocumentBuilder()
    .setTitle('API Marketplace')
    .setDescription('API Marketplace docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);

  const authService = app.get(AuthService);
  await authService.createAdminUser();

  const utilsService = app.get(UtilsService);
  await utilsService.initializeLanguages();
  await utilsService.initializeSpecializations();
  await utilsService.initializeCountries();
  // console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
