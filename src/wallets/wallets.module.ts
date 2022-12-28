import { Module } from '@nestjs/common';
import { WalletsResolver } from './wallets.resolver';
import { WalletsService } from './wallets.service';

@Module({
  imports: [],
  providers: [WalletsResolver, WalletsService],
})
export class WalletsModule { }
