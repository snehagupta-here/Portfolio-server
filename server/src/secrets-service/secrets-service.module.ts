import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import secretManagerConfig from './secrets-service.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [secretManagerConfig],
      isGlobal: true,
    }),
  ],
})
export class SecretsModule {}
