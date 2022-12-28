import { PrismaService } from 'nestjs-prisma';
import { Prisma, User, Wallet } from '@prisma/client';
import {
  Injectable,
} from '@nestjs/common';
import { cryptoPunk } from 'src/contract/CryptoPunk';

@Injectable()
export class WalletsService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  public async addWallet(userId: string, address: string): Promise<Wallet> {
    const balance = await cryptoPunk.getBalance(address);
    // if (balance) {
    //   throw Error(balance.message);
    // }

    const newWallet = this.prisma.wallet.create({
      data: {
        userId: userId,
        address: address,
        balance: balance.toNumber(),
      },
    });

    return newWallet;
  }

  public async transfer(from: string, to: string, value: number, prisma: PrismaService) {
    await prisma.wallet.updateMany({
      data: {
        balance: {
          decrement: value,
        }
      },
      where: {
        address: from,
      }
    });
    await prisma.wallet.updateMany({
      data: {
        balance: {
          increment: value,
        }
      },
      where: {
        address: to,
      }
    });
  }
}
