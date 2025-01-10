import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import {
  CryptoPrice,
  CryptoPriceDocument,
} from './schemas/crypto-price.schema';

@Injectable()
export class CryptoService {
  private readonly logger = new Logger(CryptoService.name);
  private readonly SUPPORTED_COINS = ['bitcoin', 'matic-network', 'ethereum'];

  constructor(
    @InjectModel(CryptoPrice.name)
    private cryptoPriceModel: Model<CryptoPriceDocument>,
  ) {}

  @Cron(CronExpression.EVERY_2_HOURS)
  async fetchCryptoPrices() {
    try {
      const coinsString = this.SUPPORTED_COINS.join(',');
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinsString}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`,
      );

      const promises = this.SUPPORTED_COINS.map((coinId) => {
        const data = response.data[coinId];
        return this.cryptoPriceModel.create({
          coinId,
          priceUsd: data.usd,
          marketCapUsd: data.usd_market_cap,
          change24h: data.usd_24h_change,
        });
      });

      await Promise.all(promises);
      this.logger.log('Crypto prices updated successfully');
    } catch (error) {
      this.logger.error('Error fetching crypto prices:', error);
      throw new HttpException(
        'Error fetching crypto prices',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLatestStats(coin: string) {
    if (!this.SUPPORTED_COINS.includes(coin)) {
      throw new HttpException('Unsupported coin', HttpStatus.BAD_REQUEST);
    }

    const latestPrice = await this.cryptoPriceModel
      .findOne({ coinId: coin })
      .sort({ createdAt: -1 });

    if (!latestPrice) {
      throw new HttpException('No data available', HttpStatus.NOT_FOUND);
    }

    return {
      price: latestPrice.priceUsd,
      marketCap: latestPrice.marketCapUsd,
      '24hChange': latestPrice.change24h,
    };
  }

  async getPriceDeviation(coin: string) {
    if (!this.SUPPORTED_COINS.includes(coin)) {
      throw new HttpException('Unsupported coin', HttpStatus.BAD_REQUEST);
    }

    const prices = await this.cryptoPriceModel
      .find({ coinId: coin })
      .sort({ createdAt: -1 })
      .limit(100)
      .select('priceUsd');

    if (prices.length === 0) {
      throw new HttpException('No data available', HttpStatus.NOT_FOUND);
    }

    const priceValues = prices.map((p) => p.priceUsd);
    const mean = priceValues.reduce((a, b) => a + b) / priceValues.length;
    const squaredDiffs = priceValues.map((price) => Math.pow(price - mean, 2));
    const variance =
      squaredDiffs.reduce((a, b) => a + b) / (priceValues.length - 1);
    const deviation = Math.sqrt(variance);

    return {
      deviation: Number(deviation.toFixed(2)),
    };
  }
}
