import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BuddyService } from './buddy.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Buddy/Trips')
@Controller('trips')
export class BuddyController {
  constructor(private readonly buddyService: BuddyService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all open trips' })
  @ApiResponse({ status: 200, description: 'Trips retrieved' })
  async findAll() {
    const trips = await this.buddyService.findAllOpenTrips();
    return { data: trips };
  }

  @Get('my-trips')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user trips' })
  @ApiResponse({ status: 200, description: 'User trips retrieved' })
  async getMyTrips(@CurrentUser('id') userId: string) {
    const trips = await this.buddyService.findUserTrips(userId);
    return { data: trips };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get trip by ID' })
  @ApiResponse({ status: 200, description: 'Trip found' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async findOne(@Param('id') id: string) {
    const trip = await this.buddyService.findById(id);
    return { data: trip };
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new trip' })
  @ApiResponse({ status: 201, description: 'Trip created' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() createTripDto: CreateTripDto,
  ) {
    const trip = await this.buddyService.create(userId, createTripDto);
    return { data: trip };
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update trip' })
  @ApiResponse({ status: 200, description: 'Trip updated' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() updateTripDto: UpdateTripDto,
  ) {
    const trip = await this.buddyService.update(id, userId, updateTripDto);
    return { data: trip };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete/cancel trip' })
  @ApiResponse({ status: 200, description: 'Trip cancelled' })
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    await this.buddyService.delete(id, userId);
    return { message: 'Trip cancelled successfully' };
  }

  @Post(':id/join')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Request to join trip' })
  @ApiResponse({ status: 201, description: 'Join request sent' })
  async joinTrip(@Param('id') tripId: string, @CurrentUser('id') userId: string) {
    const participant = await this.buddyService.requestToJoin(tripId, userId);
    return { data: participant };
  }

  @Put(':id/participants/:userId/accept')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept join request' })
  @ApiResponse({ status: 200, description: 'Request accepted' })
  async acceptParticipant(
    @Param('id') tripId: string,
    @Param('userId') participantUserId: string,
    @CurrentUser('id') creatorId: string,
  ) {
    const participant = await this.buddyService.handleJoinRequest(
      tripId,
      participantUserId,
      creatorId,
      true,
    );
    return { data: participant };
  }

  @Put(':id/participants/:userId/reject')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject join request' })
  @ApiResponse({ status: 200, description: 'Request rejected' })
  async rejectParticipant(
    @Param('id') tripId: string,
    @Param('userId') participantUserId: string,
    @CurrentUser('id') creatorId: string,
  ) {
    const participant = await this.buddyService.handleJoinRequest(
      tripId,
      participantUserId,
      creatorId,
      false,
    );
    return { data: participant };
  }

  @Delete(':id/leave')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave trip' })
  @ApiResponse({ status: 200, description: 'Left trip successfully' })
  async leaveTrip(@Param('id') tripId: string, @CurrentUser('id') userId: string) {
    return this.buddyService.leaveTrip(tripId, userId);
  }

  @Get('matches/suggested')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get suggested buddy matches' })
  @ApiResponse({ status: 200, description: 'Matches retrieved' })
  async getSuggestedMatches(
    @CurrentUser('id') userId: string,
    @CurrentUser('nationality') nationality: string,
  ) {
    const matches = await this.buddyService.getSuggestedMatches(userId, nationality);
    return { data: matches };
  }
}