import { ConfigService } from '@nestjs/config';

export function getCorsOptions(configService: ConfigService) {
  const clientUrl = configService.get<string>('CLIENT_URL')?.trim();

  return {
    methods: 'GET,POST,PUT,PATCH,DELETE',
    // `*` cannot be used with credentials, so wildcard mode reflects the
    // caller's origin instead.
    origin: clientUrl === '*' ? true : clientUrl,
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
}
