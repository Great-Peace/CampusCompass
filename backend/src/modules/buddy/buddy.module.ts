import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from '../../database/entities/trip.entity';
import { TripParticipant } from '../../database/entities/trip-participant.entity';
import { TripRepository } from '../../database/repositories/trip.repository';
import { BuddyService } from './buddy.service';
import { BuddyController } from './buddy.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trip, TripParticipant]),
    NotificationsModule,
  ],
  controllers: [BuddyController],
  providers: [BuddyService, TripRepository],
  exports: [BuddyService],
})
export class BuddyModule {}