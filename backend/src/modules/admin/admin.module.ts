import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { Location } from '../../database/entities/location.entity';
import { ContentReport } from '../../database/entities/content-report.entity';
import { OccupancyLog } from '../../database/entities/occupancy-log.entity';
import { UserRepository } from '../../database/repositories/user.repository';
import { LocationRepository } from '../../database/repositories/location.repository';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Location, ContentReport, OccupancyLog]),
    NotificationsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, UserRepository, LocationRepository],
  exports: [AdminService],
})
export class AdminModule {}