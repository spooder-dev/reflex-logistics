import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',

      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development'),

        PORT: Joi.number().default(3000),

        DATABASE_URL: Joi.string().required(),

        JWT_SECRET: Joi.string().min(16).required(),

        JWT_EXPIRES_IN: Joi.string().required(),

        REDIS_HOST: Joi.string().required(),

        REDIS_PORT: Joi.number().required(),

        RABBITMQ_URL: Joi.string().required(),

        LOG_LEVEL: Joi.string()
          .valid('debug', 'info', 'warn', 'error')
          .default('info'),
      }),
    }),
  ],

  controllers: [AppController], 

  providers: [AppService],
})
export class AppModule {}