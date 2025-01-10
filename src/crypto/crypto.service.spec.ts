import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CryptoService } from './crypto.service';
import { CryptoPrice } from './schemas/crypto-price.schema';
import { Model } from 'mongoose';
import { HttpException } from '@nestjs/common';
import axios from 'axios';

jest.mock('axios');

describe('CryptoService', () => {
  let service: CryptoService;
  let model: Model<CryptoPrice>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        {
          provide: getModelToken(CryptoPrice.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
    model = module.get<Model<CryptoPrice>>(getModelToken(CryptoPrice.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchCryptoPrices', () => {
    it('should fetch and save crypto prices', async () => {
      jest.spyOn(model, 'create').mockResolvedValue({} as any);
      (axios.get as jest.Mock).mockResolvedValue({
        data: {
          bitcoin: { usd: 100, usd_market_cap: 1000, usd_24h_change: 5 },
          'matic-network': { usd: 1, usd_market_cap: 10, usd_24h_change: 0.5 },
          ethereum: { usd: 200, usd_market_cap: 2000, usd_24h_change: 10 },
        },
      });

      await service.fetchCryptoPrices();
      expect(model.create).toHaveBeenCalledTimes(3);
    });

    it('should throw an error if fetching prices fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(
        new Error('Error fetching crypto prices'),
      );

      await expect(service.fetchCryptoPrices()).rejects.toThrow(HttpException);
    });
  });

  describe('getLatestStats', () => {
    it('should return latest stats for a supported coin', async () => {
      const result = { priceUsd: 100, marketCapUsd: 1000, change24h: 5 };
      jest.spyOn(model, 'findOne').mockReturnValue({
        sort: jest.fn().mockResolvedValue(result),
      } as any);

      expect(await service.getLatestStats('bitcoin')).toEqual({
        price: 100,
        marketCap: 1000,
        '24hChange': 5,
      });
    });

    it('should throw an error for unsupported coin', async () => {
      await expect(service.getLatestStats('unsupported-coin')).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if no data is available', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        sort: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.getLatestStats('bitcoin')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getPriceDeviation', () => {
    it('should return price deviation for a supported coin', async () => {
      const prices = Array(100).fill({ priceUsd: 100 });
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue(prices),
          }),
        }),
      } as any);

      expect(await service.getPriceDeviation('bitcoin')).toEqual({
        deviation: 0,
      });
    });

    it('should throw an error for unsupported coin', async () => {
      await expect(
        service.getPriceDeviation('unsupported-coin'),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an error if no data is available', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue([]),
          }),
        }),
      } as any);

      await expect(service.getPriceDeviation('bitcoin')).rejects.toThrow(
        HttpException,
      );
    });
  });
});
