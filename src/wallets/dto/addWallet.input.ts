import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddWalletInput {
  @Field()
  @IsNotEmpty()
  address: string;
}
