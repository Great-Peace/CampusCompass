import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guards';
import { UserRole } from '../../database/entities/user.entity';
import { ReportStatus } from '../../database/entities/content-report.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved' })
  async getAllUsers(@Query() pagination: PaginationDto) {
    const result = await this.adminService.getAllUsers(pagination.page, pagination.limit);
    return { data: result };
  }

  @Put('users/:id/suspend')
  @ApiOperation({ summary: 'Suspend user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User suspended' })
  async suspendUser(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.adminService.suspendUser(id, reason);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get content reports (Admin only)' })
  @ApiResponse({ status: 200, description: 'Reports retrieved' })
  async getReports(@Query('status') status?: ReportStatus) {
    const reports = await this.adminService.getContentReports(status);
    return { data: reports };
  }

  @Put('reports/:id')
  @ApiOperation({ summary: 'Handle content report (Admin only)' })
  @ApiResponse({ status: 200, description: 'Report handled' })
  async handleReport(
    @Param('id') id: string,
    @Body('status') status: ReportStatus,
    @Body('adminNotes') adminNotes: string,
  ) {
    const report = await this.adminService.handleReport(id, status, adminNotes);
    return { data: report };
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get platform analytics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved' })
  async getAnalytics() {
    const analytics = await this.adminService.getAnalytics();
    return { data: analytics };
  }

  @Post('locations/import')
  @ApiOperation({ summary: 'Bulk import locations (Admin only)' })
  @ApiResponse({ status: 201, description: 'Locations imported' })
  async importLocations(@Body('locations') locations: any[]) {
    const result = await this.adminService.importLocations(locations);
    return { data: result };
  }

  @Post('notifications/broadcast')
  @ApiOperation({ summary: 'Broadcast notification (Admin only)' })
  @ApiResponse({ status: 201, description: 'Notification broadcasted' })
  async broadcastNotification(
    @Body('title') title: string,
    @Body('message') message: string,
    @Body('userIds') userIds?: string[],
  ) {
    return this.adminService.broadcastNotification(title, message, userIds);
  }
}