import { ConfigService } from '@nestjs/config';

function getClientOrigins(configService: ConfigService) {
  return (configService.get<string>('CLIENT_URL') ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function getCorsOptions(configService: ConfigService) {
  const clientOrigins = getClientOrigins(configService);

  return {
    methods: 'GET,POST,PUT,PATCH,DELETE',
    // `*` cannot be used with credentials, so wildcard mode reflects the
    // caller's origin instead.
    origin: clientOrigins.includes('*')
      ? true
      : clientOrigins.length === 1
        ? clientOrigins[0]
        : clientOrigins,
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
}
