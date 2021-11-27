import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
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

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
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
    UploadsModule,
    // CommonModule,
    WithdrawsModule,
    TaxesModule,
    ShippingsModule,
    AnalyticsModule,
    ImportsModule,
    WalletsModule,
    RefundsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
