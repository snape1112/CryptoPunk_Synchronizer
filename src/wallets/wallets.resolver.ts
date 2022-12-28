import { PrismaService } from 'nestjs-prisma';
import {
  Resolver,
  Query,
  Parent,
  Args,
  ResolveField,
  Subscription,
  Mutation,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/models/user.model';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserIdArgs } from './args/user-id.args';
import { Wallet } from './models/wallet.model';
import { AddWalletInput } from './dto/addWallet.input';
import { WalletsService } from './wallets.service';
import { WalletAddressArgs } from './args/wallet-address.args';

@Resolver(() => Wallet)
export class WalletsResolver {
  constructor(private walletsService: WalletsService, private prisma: PrismaService) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Wallet)
  async addWallet(
    @UserEntity() user: User,
    @Args('data') data: AddWalletInput
  ) {
    return await this.walletsService.addWallet(user.id, data.address);
  }

  @Query(() => [Wallet])
  @UseGuards(GqlAuthGuard)
  userWallets(@UserEntity() user: User) {
    return this.prisma.user
      .findUnique({ where: { id: user.id } })
      .wallets();
  }

  @Query(() => Wallet)
  @UseGuards(GqlAuthGuard)
  async wallet(@UserEntity() user: User, @Args() args: WalletAddressArgs) {
    return this.prisma.wallet.findFirst({ where: { id: args.address, userId: user.id } });
  }

  @ResolveField('user', () => User)
  async author(@Parent() wallet: Wallet) {
    return this.prisma.wallet.findUnique({ where: { id: wallet.id } }).user();
  }
}
