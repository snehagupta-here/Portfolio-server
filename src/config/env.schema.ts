import { z } from 'zod';

import { configDefaults } from './config.constants';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(configDefaults.app.port),
  CLIENT_URL: z.string().trim().min(1, 'CLIENT_URL is required'),
  DB_URL: z
    .string()
    .trim()
    .min(1, 'DB_URL is required')
    .refine(
      (value) =>
        value.startsWith('mongodb://') || value.startsWith('mongodb+srv://'),
      'DB_URL must be a valid MongoDB connection string',
    ),
  MONGO_CONNECT_TIMEOUT_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(configDefaults.mongo.connectTimeoutSeconds),
  MONGO_MAX_RETRIES: z.coerce
    .number()
    .int()
    .min(1)
    .default(configDefaults.mongo.maxRetries),
  MONGO_RETRY_DELAY_SECONDS: z.coerce
    .number()
    .int()
    .min(0)
    .default(configDefaults.mongo.retryDelaySeconds),
  MONGO_COOLDOWN_SECONDS: z.coerce
    .number()
    .int()
    .min(0)
    .default(configDefaults.mongo.cooldownSeconds),
  MONGO_DB_DEV: z
    .string()
    .trim()
    .min(1)
    .default(configDefaults.mongo.devDbName),
  MONGO_DB_PROD: z
    .string()
    .trim()
    .min(1)
    .default(configDefaults.mongo.prodDbName),
  CLOUDINARY_CLOUD_NAME: z.string().trim().optional().default(''),
  CLOUDINARY_API_KEY: z.string().trim().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().trim().optional().default(''),
  CLOUDINARY_MAX_RETRIES: z.coerce
    .number()
    .int()
    .min(1)
    .default(configDefaults.cloudinary.maxRetries),
  CLOUDINARY_RETRY_DELAY_SECONDS: z.coerce
    .number()
    .int()
    .min(0)
    .default(configDefaults.cloudinary.retryDelaySeconds),
  CLOUDINARY_COOLDOWN_SECONDS: z.coerce
    .number()
    .int()
    .min(0)
    .default(configDefaults.cloudinary.cooldownSeconds),
});

export type EnvSchema = z.infer<typeof envSchema>;
