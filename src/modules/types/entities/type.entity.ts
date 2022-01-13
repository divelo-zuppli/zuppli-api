import { InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
@InputType('TypeInputType', { isAbstract: true })
@ObjectType()
export class Type extends CoreEntity {
  name: string;
  slug: string;
  icon: string;
  banners?: Banner[];
  settings?: TypeSettings;
}

@InputType('BannerInputType', { isAbstract: true })
@ObjectType()
export class Banner extends CoreEntity {
  title?: string;
  description?: string;
}

@InputType('TypeSettingsInputType', { isAbstract: true })
@ObjectType()
export class TypeSettings {
  isHome: boolean;
  layoutType: string;
  productCard: string;
}
