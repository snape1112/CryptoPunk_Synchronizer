import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.cryptoTransfer.deleteMany();

  console.log('Seeding...');

  const user1 = await prisma.user.create({
    data: {
      email: 'lisa@simpson.com',
      firstname: 'Lisa',
      lastname: 'Simpson',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      role: 'USER',
      posts: {
        create: {
          title: 'Join us for Prisma Day 2019 in Berlin',
          content: 'https://www.prisma.io/day/',
          published: true,
        },
      },
      wallets: {
        create: {
          address: '0x897aEA3D51DCBA918C41aE23F5d9A7411671DeE0',
          balance: 9
        }
      }
    },
  });
  const user2 = await prisma.user.create({
    data: {
      email: 'bart@simpson.com',
      firstname: 'Bart',
      lastname: 'Simpson',
      role: 'ADMIN',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      posts: {
        create: [
          {
            title: 'Subscribe to GraphQL Weekly for community news',
            content: 'https://graphqlweekly.com/',
            published: true,
          },
          {
            title: 'Follow Prisma on Twitter',
            content: 'https://twitter.com/prisma',
            published: false,
          },
        ],
      },
      wallets: {
        create: {
          address: '0xa25803ab86A327786Bb59395fC0164D826B98298',
          balance: 215
        }
      }
    },
  });

  const transfer = await prisma.cryptoTransfer.createMany({
    data: [{
      from: '0xf5c1d55e94726962b4b517c949120c42d646e455',
      to: '0x9b338fddc58a3a28042ff3fc9ae3ecbcfe0de267',
      value: 1,
      blockNumber: 16270243,
      blockHash: '0xa5765c30808ef8e9c1ef76469e446d2ebd7da5a01bbd8e72c33ff10b7d4c1588',
      transactionHash: '0x2ef22f5d3e795914c4baa9333a48f3a48b1d55c41d3ab5d53aa058de53661cac',
    }, {
      from: '0x1919db36ca2fa2e15f9000fd9cdc2edcf863e685',
      to: '0x0232d1083e970f0c78f56202b9a666b526fa379f',
      value: 1,
      blockNumber: 16269417,
      blockHash: '0xde4b6971ad1c42195246457e032d0349295383aee433a0231a029865d43910de',
      transactionHash: '0xd8f88808570828e2001f459c88edc932fc2eddb31c3e036c6f4aca32c1446593',
    }]
  })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
