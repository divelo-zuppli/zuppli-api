import { ObjectType, InputType } from '@nestjs/graphql';
import { Address } from 'src/modules/addresses/entities/address.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Refund } from 'src/modules/refunds/entities/refund.entity';
import { Shop } from 'src/modules/shops/entities/shop.entity';
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { Profile } from './profile.entity';

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
export class OldUser extends CoreEntity {
  name: string;
  email: string;
  password?: string;
  shop_id?: number;
  profile?: Profile;
  shops?: Shop[];
  refunds?: Refund[];
  managed_shop?: Shop;
  is_active?: boolean = true;
  address?: Address[];
  orders?: Order[];
  wallet?: Wallet;
}
