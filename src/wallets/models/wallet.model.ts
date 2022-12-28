import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';
import { BaseModel } from 'src/common/models/base.model';

@ObjectType()
export class Wallet extends BaseModel {
  @Field()
  address: string;

  @Field()
  balance: Number;

  @Field(() => User)
  user: User;
}
