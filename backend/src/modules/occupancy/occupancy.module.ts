import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OccupancyLog } from '../../database/entities/occupancy-log.entity';
import { Location } from '../../database/entities/location.entity';
import { OccupancyLogRepository } from '../../database/repositories/occupancy-log.repository';
import { LocationRepository } from '../../database/repositories/location.repository';
import { OccupancyService } from './occupancy.service';
import { OccupancyController } from './occupancy.controller';
import { OccupancyGateway } from './occupancy.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([OccupancyLog, Location])],
  controllers: [OccupancyController],
  providers: [OccupancyService, OccupancyLogRepository, LocationRepository, OccupancyGateway],
  exports: [OccupancyService],
})
export class OccupancyModule {}