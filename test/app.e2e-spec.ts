import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { CryptoPrice } from './../src/crypto/schemas/crypto-price.schema';
import { Model } from 'mongoose';

describe('CryptoController (e2e)', () => {
  let app: INestApplication;
  let cryptoPriceModel: Model<CryptoPrice>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    cryptoPriceModel = moduleFixture.get<Model<CryptoPrice>>(
      getModelToken(CryptoPrice.name),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await cryptoPriceModel.deleteMany({});
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/').expect(200);

    expect(response.text).toBe('Hello World!');
  });

  it('/crypto/stats (GET)', async () => {
    await cryptoPriceModel.create({
      coinId: 'bitcoin',
      priceUsd: 100,
      marketCapUsd: 1000,
      change24h: 5,
    });

    const response = await request(app.getHttpServer())
      .get('/crypto/stats')
      .query({ coin: 'bitcoin' })
      .expect(200);

    expect(response.body).toEqual({
      price: 100,
      marketCap: 1000,
      '24hChange': 5,
    });
  });

  it('/crypto/deviation (GET)', async () => {
    const prices = Array(100).fill({
      coinId: 'bitcoin',
      priceUsd: 100,
      marketCapUsd: 1000,
      change24h: 5,
    });
    await cryptoPriceModel.insertMany(prices);

    const response = await request(app.getHttpServer())
      .get('/crypto/deviation')
      .query({ coin: 'bitcoin' })
      .expect(200);

    expect(response.body).toEqual({
      deviation: 0,
    });
  });

  it('/crypto/fetch-prices (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/crypto/fetch-prices')
      .expect(200);

    expect(response.body).toEqual({
      message: 'Prices fetched successfully',
    });
  });
});
