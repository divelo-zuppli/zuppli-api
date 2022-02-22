import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';

import appConfig from './config/app.config';
import appSchema from './config/app.schema';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './modules/user/user.module';
import { ParameterModule } from './modules/parameter/parameter.module';
import { AttachmentModule } from './modules/attachment/attachment.module';
import { CategoryModule } from './modules/category/category.module';
import { CategoryAttachmentModule } from './modules/category-attachment/category-attachment.module';
import { ReferenceModule } from './modules/reference/reference.module';

@Module({
  imports: [
    // config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: appSchema,
    }),

    // graphql
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          autoSchemaFile: join(process.cwd(), 'schema.gql'),
          sortSchema: true,
          introspection: true,
          installSubscriptionHandlers: true,
          playground:
            configService.get<string>('config.environment') === 'development',
          formatError: (error) => {
            console.error(error);
            return error;
          },
        };
      },
    }),

    // modules
    UserModule,
    ParameterModule,
    AttachmentModule,
    CategoryModule,
    CategoryAttachmentModule,
    ReferenceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
