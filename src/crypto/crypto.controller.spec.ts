import { Test, TestingModule } from '@nestjs/testing';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';

describe('CryptoController', () => {
  let controller: CryptoController;
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoController],
      providers: [
        {
          provide: CryptoService,
          useValue: {
            getLatestStats: jest.fn(),
            getPriceDeviation: jest.fn(),
            fetchCryptoPrices: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CryptoController>(CryptoController);
    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStats', () => {
    it('should return latest stats for a coin', async () => {
      const result = { price: 100, marketCap: 1000, '24hChange': 5 };
      jest.spyOn(service, 'getLatestStats').mockResolvedValue(result);

      expect(await controller.getStats('bitcoin')).toBe(result);
    });
  });

  describe('getDeviation', () => {
    it('should return price deviation for a coin', async () => {
      const result = { deviation: 2.5 };
      jest.spyOn(service, 'getPriceDeviation').mockResolvedValue(result);

      expect(await controller.getDeviation('bitcoin')).toBe(result);
    });
  });

  describe('fetchPrices', () => {
    it('should fetch crypto prices', async () => {
      jest.spyOn(service, 'fetchCryptoPrices').mockResolvedValue(undefined);

      expect(await controller.fetchPrices()).toEqual({
        message: 'Prices fetched successfully',
      });
    });
  });
});
