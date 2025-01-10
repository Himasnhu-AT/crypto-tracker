import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoModule } from './crypto/crypto.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/crypto-tracker'),
    CryptoModule, // Import the CryptoModule here
  ],
  controllers: [AppController], // Add AppController here
  providers: [AppService], // Add AppService here
})
export class AppModule {}
