import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ContactUsController } from './contact-us/contact-us.controller';
import { ContactUsService } from './contact-us/contact-us.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { SecretsModule } from './secrets-service/secrets-service.module';
import { ContactUs, ContactUsSchema } from './schema/contact-us.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [SecretsModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('dbUrl'),
      }),
      inject: [ConfigService],
      connectionName: 'db',
    }),
     MongooseModule.forFeature(
      [{ name: ContactUs.name, schema: ContactUsSchema }],
      'db',
    ),
    SecretsModule,
  ],
  controllers: [ContactUsController],
  providers: [AppService, ContactUsService, ConfigService,],
  exports: [ConfigService],
})
export class AppModule {}
