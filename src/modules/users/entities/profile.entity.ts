import { ObjectType, InputType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { OldUser } from './user.entity';

@InputType('ProfileInputType', { isAbstract: true })
@ObjectType()
export class Profile extends CoreEntity {
  bio?: string;
  socials?: Social[];
  contact?: string;
  customer?: OldUser;
}

@InputType('SocialInputType', { isAbstract: true })
@ObjectType()
export class Social {
  type: string;
  link: string;
}
