# Sample KoinX backend

This is a sample backend for KoinX, a cryptocurrency exchange. It is built on NestJS and uses Mongodb (mongoose) for database operations.

## Installation

```bash
pnpm install
# or
npm install
```

## Setup Database

- Create a `.env` file in the root directory of the project
- Add the following environment variables to the `.env` file

```bash
MONGO_URI=mongodb://localhost:27017/crypto-tracker
```

## Running the app

### Using pnpm

```bash
# development
pnpm start:dev
# or
# production
pnpm start:prod
```

### Using docker

```bash
docker-compose up -d app # for running only the app
# or
docker-compose up -d # for running the app and mongodb
```

## Test

```bash
# unit tests
pnpm test
# or
# e2e tests
pnpm test:e2e
```

## Unit Test:

Files:

- `app.controller.spec.ts`: Test for AppController
- `crypto.controller.spec.ts`: Test for CryptoController
- `crypto.service.spec.ts`: Test for CryptoService

```bash
himanshu@Himanshus-3 crypto-tracker % pnpm test

> crypto-tracker@0.0.1 test /Users/himanshu/codes/crypto-tracker
> jest

 PASS  src/app.controller.spec.ts
[Nest] 31024  - 01/10/2025, 8:22:29 PM   ERROR [CryptoService] Error fetching crypto prices:
[Nest] 31024  - 01/10/2025, 8:22:29 PM   ERROR [CryptoService] Error: Error fetching crypto prices
 PASS  src/crypto/crypto.service.spec.ts
 PASS  src/crypto/crypto.controller.spec.ts

Test Suites: 3 passed, 3 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        2.979 s, estimated 3 s
Ran all test suites.
himanshu@Himanshus-3 crypto-tracker %
```

## E2E Test:

Files:

- `app.e2e-spec.ts`: complete E2E test for the app

```bash
himanshu@Himanshus-3 crypto-tracker % pnpm test:e2e

> crypto-tracker@0.0.1 test:e2e /Users/himanshu/codes/crypto-tracker
> jest --config ./test/jest-e2e.json

 PASS  test/app.e2e-spec.ts
  CryptoController (e2e)
    ✓ / (GET) (26 ms)
    ✓ /crypto/stats (GET) (16 ms)
    ✓ /crypto/deviation (GET) (27 ms)
    ✓ /crypto/fetch-prices (GET) (1012 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        3.594 s
Ran all test suites.
himanshu@Himanshus-3 crypto-tracker %
```

## API Endpoints

### 1. Fetch Latest Cryptocurrency Stats

**Endpoint:** `GET /crypto/stats`

**Description:** This endpoint returns the latest data about the requested cryptocurrency.

**Query Parameters:**

- `coin`: The ID of the cryptocurrency. It can be one of the following values: `bitcoin`, `matic-network`, `ethereum`.

**Sample Request:**

```http
GET /crypto/stats?coin=bitcoin
```

**Sample Response:**

```json
{
  "price": 40000,
  "marketCap": 800000000,
  "24hChange": 3.4
}
```

### 2. Fetch Price Deviation

**Endpoint:** `GET /crypto/deviation`

**Description:** This endpoint returns the standard deviation of the price of the requested cryptocurrency for the last 100 records stored by the background service in the database.

**Query Parameters:**

- `coin`: The ID of the cryptocurrency. It can be one of the following values: `bitcoin`, `matic-network`, `ethereum`.

**Sample Request:**

```http
GET /crypto/deviation?coin=bitcoin
```

**Sample Response:**

```json
{
  "deviation": 4082.48
}
```

### 3. Manually Trigger Fetching of Crypto Prices

**Endpoint:** `GET /crypto/fetch-prices`

**Description:** This endpoint manually triggers the background job to fetch the current price in USD, market cap in USD, and 24-hour change of the supported cryptocurrencies and store it in the database.

**Sample Request:**

```http
GET /crypto/fetch-prices
```

**Sample Response:**

```json
{
  "message": "Prices fetched successfully"
}
```

### 4. Default Endpoint

**Endpoint:** `GET /`

**Description:** This endpoint returns a simple "Hello World!" message to verify that the server is running.

**Sample Request:**

```http
GET /
```

**Sample Response:**

```text
Hello World!
```

---

These endpoints provide the necessary functionalities to fetch and analyze cryptocurrency data, ensuring that the application meets the requirements of the KoinX Backend Internship Assignment.
