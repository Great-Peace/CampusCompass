import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OccupancyService } from './occupancy.service';
import { UpdateOccupancyDto } from './dto/update-occupancy.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../../database/entities/user.entity';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Occupancy')
@Controller('occupancy')
export class OccupancyController {
  constructor(private readonly occupancyService: OccupancyService) {}

  @Public()
  @Get('location/:id')
  @ApiOperation({ summary: 'Get current occupancy for a location' })
  @ApiResponse({ status: 200, description: 'Current occupancy status' })
  async getCurrentOccupancy(@Param('id') id: string) {
    const data = await this.occupancyService.getCurrentOccupancy(id);
    return { data };
  }

  @Post('update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update occupancy status' })
  @ApiResponse({ status: 201, description: 'Occupancy updated' })
  async updateOccupancy(
    @CurrentUser('id') userId: string,
    @Body() updateOccupancyDto: UpdateOccupancyDto,
  ) {
    const log = await this.occupancyService.updateOccupancy(userId, updateOccupancyDto);
    return { data: log };
  }

  @Public()
  @Get('history/:locationId')
  @ApiOperation({ summary: 'Get occupancy history for a location' })
  @ApiResponse({ status: 200, description: 'Historical data retrieved' })
  async getHistory(
    @Param('locationId') locationId: string,
    @Query('days') days?: number,
  ) {
    const data = await this.occupancyService.getLocationHistory(
      locationId,
      days ? Number(days) : undefined,
    );
    return { data };
  }

  @Put('verify/:id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Verify occupancy log (Admin only)' })
  @ApiResponse({ status: 200, description: 'Log verified' })
  async verifyOccupancy(@Param('id') id: string) {
    return this.occupancyService.verifyOccupancy(id);
  }
}