import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../database/repositories/user.repository';
import { LocationRepository } from '../../database/repositories/location.repository';
import { ContentReport, ReportStatus } from '../../database/entities/content-report.entity';
import { OccupancyLog } from '../../database/entities/occupancy-log.entity';
import { UserStatus } from '../../database/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly locationRepository: LocationRepository,
    @InjectRepository(ContentReport)
    private readonly contentReportRepository: Repository<ContentReport>,
    @InjectRepository(OccupancyLog)
    private readonly occupancyLogRepository: Repository<OccupancyLog>,
    private readonly notificationsService: NotificationsService,
  ) {}

  // User Management
  async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [users, total] = await this.userRepository.repository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async suspendUser(userId: string, reason?: string) {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.suspendUser(userId);

    // Notify user
    await this.notificationsService.create({
      userId,
      type: 'system_announcement',
      title: 'Account Suspended',
      message: reason || 'Your account has been suspended. Contact support for more information.',
      data: { reason },
    });

    return { message: 'User suspended successfully' };
  }

  async deleteUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(userId);
    return { message: 'User deleted successfully' };
  }

  // Content Moderation
  async getContentReports(status?: ReportStatus) {
    const where = status ? { status } : {};
    
    const reports = await this.contentReportRepository.find({
      where,
      relations: ['reporter'],
      order: { createdAt: 'DESC' },
    });

    return reports;
  }

  async handleReport(reportId: string, status: ReportStatus, adminNotes: string) {
    const report = await this.contentReportRepository.findOne({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.status = status;
    report.adminNotes = adminNotes;
    await this.contentReportRepository.save(report);

    return report;
  }

  // Analytics
  async getAnalytics() {
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({ status: UserStatus.ACTIVE });
    const totalLocations = await this.locationRepository.count();
    
    const recentOccupancyUpdates = await this.occupancyLogRepository.count({
      where: {
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) as any, // Last 24 hours
      },
    });

    const pendingReports = await this.contentReportRepository.count({
      where: { status: ReportStatus.PENDING },
    });

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        suspended: totalUsers - activeUsers,
      },
      locations: {
        total: totalLocations,
      },
      occupancy: {
        recentUpdates: recentOccupancyUpdates,
      },
      reports: {
        pending: pendingReports,
      },
    };
  }

  // Bulk Import Locations
  async importLocations(locations: any[]) {
    const imported = await Promise.all(
      locations.map((location) => this.locationRepository.create(location)),
    );

    return {
      imported: imported.length,
      locations: imported,
    };
  }

  // Broadcast Notification
  async broadcastNotification(title: string, message: string, userIds?: string[]) {
    let targetUsers: string[];

    if (userIds && userIds.length > 0) {
      targetUsers = userIds;
    } else {
      const users = await this.userRepository.findActiveUsers();
      targetUsers = users.map((u) => u.id);
    }

    await this.notificationsService.sendBulkNotification(targetUsers, {
      type: 'system_announcement',
      title,
      message,
    });

    return {
      message: 'Notification broadcasted',
      recipients: targetUsers.length,
    };
  }
}