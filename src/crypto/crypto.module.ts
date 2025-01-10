import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoService } from './crypto.service';
import { CryptoController } from './crypto.controller';
import { CryptoPrice, CryptoPriceSchema } from './schemas/crypto-price.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CryptoPrice.name, schema: CryptoPriceSchema },
    ]),
  ],
  controllers: [CryptoController],
  providers: [CryptoService],
})
export class CryptoModule {}
