import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { SearchQueryDto } from '../../common/dto/search-query.dto';
import { CoordinatesDto } from '../../common/dto/coordinates.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guards';
import { UserRole } from '../../database/entities/user.entity';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({ status: 200, description: 'Locations retrieved successfully' })
  async findAll() {
    const locations = await this.locationsService.findAll();
    return { data: locations };
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search locations by name' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async search(@Query() query: SearchQueryDto) {
    const locations = await this.locationsService.search(query.q || '');
    return { data: locations };
  }

  @Public()
  @Get('nearby')
  @ApiOperation({ summary: 'Find nearby locations' })
  @ApiResponse({ status: 200, description: 'Nearby locations' })
  async findNearby(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
    @Query('radius') radius?: number,
  ) {
    const locations = await this.locationsService.findNearby(
      Number(latitude),
      Number(longitude),
      radius ? Number(radius) : undefined,
    );
    return { data: locations };
  }

  @Public()
  @Post('route')
  @ApiOperation({ summary: 'Calculate route between two locations' })
  @ApiResponse({ status: 200, description: 'Route calculated' })
  async calculateRoute(
    @Body('fromId') fromId: string,
    @Body('toId') toId: string,
  ) {
    const route = await this.locationsService.calculateRoute(fromId, toId);
    return { data: route };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get location by ID' })
  @ApiResponse({ status: 200, description: 'Location found' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async findOne(@Param('id') id: string) {
    const location = await this.locationsService.findById(id);
    return { data: location };
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new location (Admin only)' })
  @ApiResponse({ status: 201, description: 'Location created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createLocationDto: CreateLocationDto) {
    const location = await this.locationsService.create(createLocationDto);
    return { data: location };
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update location (Admin only)' })
  @ApiResponse({ status: 200, description: 'Location updated' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateLocationDto>,
  ) {
    const location = await this.locationsService.update(id, updateData);
    return { data: location };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete location (Admin only)' })
  @ApiResponse({ status: 200, description: 'Location deleted' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async delete(@Param('id') id: string) {
    await this.locationsService.delete(id);
    return { message: 'Location deleted successfully' };
  }
}