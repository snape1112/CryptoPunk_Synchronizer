import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import { AppModule } from './app.module';
import { ethers } from 'ethers';
import { createWriteStream } from 'fs';
import type {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from 'src/common/configs/config.interface';

async function synchronizeTransfer() {
  const contractABI = require('../abi/cryptopunk.json');
  /* for mainnet */
  // const contractAddress = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB";
  // const provider = new ethers.providers.WebSocketProvider('wss://mainnet.infura.io/ws/v3/' + process.env.INFURA_KEY);
  /* for testnet */
  const contractAddress = "0xF4a85c5C64a470C9f5603cD5aD6D9a634bB590DA";
  const provider = new ethers.providers.WebSocketProvider('wss://goerli.infura.io/ws/v3/' + process.env.INFURA_KEY);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  contract.on("Transfer", (from, to, value, event) => {
    let info = {
      from: from,
      to: to,
      value: ethers.utils.formatUnits(value, 6),
      data: event,
    };

    var stream = createWriteStream("my_file.txt");
    stream.once('open', function (fd) {
      stream.write(JSON.stringify(info, null, 4));
      stream.end();
    });

    console.log(JSON.stringify(info, null, 4));
  });
}
synchronizeTransfer();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'Nestjs')
      .setDescription(swaggerConfig.description || 'The nestjs API description')
      .setVersion(swaggerConfig.version || '1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
  }

  // Cors
  if (corsConfig.enabled) {
    app.enableCors();
  }

  await app.listen(process.env.PORT || nestConfig.port || 3000);
}
bootstrap();
