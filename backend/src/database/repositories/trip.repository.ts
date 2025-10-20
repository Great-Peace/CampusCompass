import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Trip, TripStatus } from '../entities/trip.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class TripRepository extends BaseRepository<Trip> {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {
    super(tripRepository);
  }

  async findOpenTrips(): Promise<Trip[]> {
    return this.tripRepository.find({
      where: {
        status: TripStatus.OPEN,
        dateTime: MoreThan(new Date()),
      },
      relations: ['creator', 'participants', 'participants.user'],
      order: { dateTime: 'ASC' },
    });
  }

  async findByCreator(creatorId: string): Promise<Trip[]> {
    return this.tripRepository.find({
      where: { creatorId },
      relations: ['participants', 'participants.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findUserTrips(userId: string): Promise<Trip[]> {
    return this.tripRepository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.creator', 'creator')
      .leftJoinAndSelect('trip.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'user')
      .where('trip.creatorId = :userId', { userId })
      .orWhere('participants.userId = :userId', { userId })
      .orderBy('trip.dateTime', 'DESC')
      .getMany();
  }

  async incrementParticipants(tripId: string): Promise<void> {
    await this.tripRepository.increment({ id: tripId }, 'currentParticipants', 1);
  }

  async decrementParticipants(tripId: string): Promise<void> {
    await this.tripRepository.decrement({ id: tripId }, 'currentParticipants', 1);
  }
}