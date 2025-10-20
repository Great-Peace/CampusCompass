import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { OccupancyLog, OccupancyStatus } from '../entities/occupancy-log.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class OccupancyLogRepository extends BaseRepository<OccupancyLog> {
  constructor(
    @InjectRepository(OccupancyLog)
    private readonly occupancyLogRepository: Repository<OccupancyLog>,
  ) {
    super(occupancyLogRepository);
  }

  async findLatestByLocation(locationId: string): Promise<OccupancyLog | null> {
    return this.occupancyLogRepository.findOne({
      where: { locationId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByLocationAndDateRange(
    locationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<OccupancyLog[]> {
    return this.occupancyLogRepository.find({
      where: {
        locationId,
        createdAt: Between(startDate, endDate),
      },
      order: { createdAt: 'ASC' },
    });
  }

  async getLocationOccupancyStats(locationId: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await this.occupancyLogRepository
      .createQueryBuilder('log')
      .select('log.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('log.locationId = :locationId', { locationId })
      .andWhere('log.createdAt >= :startDate', { startDate })
      .groupBy('log.status')
      .getRawMany();

    return stats;
  }

  async verifyLog(logId: string): Promise<void> {
    await this.occupancyLogRepository.update(logId, { verified: true });
  }
}