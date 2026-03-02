
import { ConfigService } from '@nestjs/config';
export default () => {
  const configService = new ConfigService();
  const dbUrl = configService.get('DB_URL');
  return {
    dbUrl
    };
};
