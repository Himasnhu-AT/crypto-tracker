import { Controller, Get, Query } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('stats')
  async getStats(@Query('coin') coin: string) {
    return this.cryptoService.getLatestStats(coin);
  }

  @Get('deviation')
  async getDeviation(@Query('coin') coin: string) {
    return this.cryptoService.getPriceDeviation(coin);
  }

  // Temporary endpoint to manually trigger fetchCryptoPrices
  @Get('fetch-prices')
  async fetchPrices() {
    await this.cryptoService.fetchCryptoPrices();
    return { message: 'Prices fetched successfully' };
  }
}
