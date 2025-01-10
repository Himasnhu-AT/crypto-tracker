import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CryptoPrice {
  @Prop({ required: true })
  coinId: string;

  @Prop({ required: true })
  priceUsd: number;

  @Prop({ required: true })
  marketCapUsd: number;

  @Prop({ required: true })
  change24h: number;
}

export type CryptoPriceDocument = CryptoPrice & Document;
export const CryptoPriceSchema = SchemaFactory.createForClass(CryptoPrice);
