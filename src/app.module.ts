import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import appConfig from './config/app.config';
import appSchema from './config/app.schema';

import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { SettingsModule } from './modules/settings/settings.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AttributesModule } from './modules/attributes/attributes.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { ShopsModule } from './modules/shops/shops.module';
import { TypesModule } from './modules/types/types.module';
import { TagsModule } from './modules/tags/tags.module';
import { UploadsModule } from './modules/uploads/uploads.module';
// import { CommonModule } from './common/common.module';
import { WithdrawsModule } from './modules/withdraws/withdraws.module';
import { TaxesModule } from './modules/taxes/taxes.module';
import { ShippingsModule } from './modules/shippings/shippings.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ImportsModule } from './modules/imports/imports.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { RefundsModule } from './modules/refunds/refunds.module';
import { ParameterModule } from './modules/parameter/parameter.module';
import { CategoryAttachmentModule } from './modules/category-attachment/category-attachment.module';
import { AttachmentModule } from './modules/attachment/attachment.module';

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
    UsersModule,
    ProductsModule,
    OrdersModule,
    SettingsModule,
    CouponsModule,
    CategoriesModule,
    AttributesModule,
    AddressesModule,
    ShopsModule,
    TypesModule,
    TagsModule,
    // CommonModule,
    WithdrawsModule,
    TaxesModule,
    ShippingsModule,
    AnalyticsModule,
    ImportsModule,
    WalletsModule,
    RefundsModule,
    ParameterModule,
    CategoryAttachmentModule,
    AttachmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
