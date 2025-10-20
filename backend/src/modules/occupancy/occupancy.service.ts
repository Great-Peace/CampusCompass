import { Injectable, NotFoundException } from '@nestjs/common';
import { OccupancyLogRepository } from '../../database/repositories/occupancy-log.repository';
import { LocationRepository } from '../../database/repositories/location.repository';
import { UpdateOccupancyDto } from './dto/update-occupancy.dto';
import { OccupancyGateway } from './occupancy.gateway';

@Injectable()
export class OccupancyService {
  constructor(
    private readonly occupancyLogRepository: OccupancyLogRepository,
    private readonly locationRepository: LocationRepository,
    private readonly occupancyGateway: OccupancyGateway,
  ) {}

  async getCurrentOccupancy(locationId: string) {
    const location = await this.locationRepository.findById(locationId);
    
    if (!location) {
      throw new NotFoundException('Location not found');
    }

    const latestLog = await this.occupancyLogRepository.findLatestByLocation(locationId);

    return {
      location,
      currentStatus: latestLog?.status || 'free',
      lastUpdated: latestLog?.createdAt || null,
      verified: latestLog?.verified || false,
    };
  }

  async updateOccupancy(userId: string, updateOccupancyDto: UpdateOccupancyDto) {
    const location = await this.locationRepository.findById(updateOccupancyDto.locationId);
    
    if (!location) {
      throw new NotFoundException('Location not found');
    }

    const log = await this.occupancyLogRepository.create({
      locationId: updateOccupancyDto.locationId,
      status: updateOccupancyDto.status,
      source: updateOccupancyDto.source,
      userId,
    });

    // Emit real-time update via WebSocket
    this.occupancyGateway.emitOccupancyUpdate({
      locationId: location.id,
      locationName: location.name,
      status: log.status,
      timestamp: log.createdAt,
    });

    return log;
  }

  async getLocationHistory(locationId: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const endDate = new Date();

    const logs = await this.occupancyLogRepository.findByLocationAndDateRange(
      locationId,
      startDate,
      endDate,
    );

    const stats = await this.occupancyLogRepository.getLocationOccupancyStats(locationId, days);

    return {
      logs,
      stats,
      period: { startDate, endDate, days },
    };
  }

  async verifyOccupancy(logId: string) {
    await this.occupancyLogRepository.verifyLog(logId);
    return { message: 'Occupancy log verified' };
  }
}