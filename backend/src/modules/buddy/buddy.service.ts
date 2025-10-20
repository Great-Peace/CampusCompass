import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripRepository } from '../../database/repositories/trip.repository';
import { TripParticipant, ParticipantStatus } from '../../database/entities/trip-participant.entity';
import { TripStatus } from '../../database/entities/trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BuddyService {
  constructor(
    private readonly tripRepository: TripRepository,
    @InjectRepository(TripParticipant)
    private readonly participantRepository: Repository<TripParticipant>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAllOpenTrips() {
    return this.tripRepository.findOpenTrips();
  }

  async findById(id: string) {
    const trip = await this.tripRepository.findById(id);
    
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    
    return trip;
  }

  async findUserTrips(userId: string) {
    return this.tripRepository.findUserTrips(userId);
  }

  async create(creatorId: string, createTripDto: CreateTripDto) {
    const trip = await this.tripRepository.create({
      ...createTripDto,
      creatorId,
      dateTime: new Date(createTripDto.dateTime),
      currentParticipants: 1,
    });

    // Creator automatically joins their own trip
    await this.participantRepository.save({
      tripId: trip.id,
      userId: creatorId,
      status: ParticipantStatus.ACCEPTED,
    });

    return trip;
  }

  async update(id: string, userId: string, updateTripDto: UpdateTripDto) {
    const trip = await this.findById(id);
    
    if (trip.creatorId !== userId) {
      throw new ForbiddenException('You can only update your own trips');
    }
    
    return this.tripRepository.update(id, updateTripDto);
  }

  async delete(id: string, userId: string) {
    const trip = await this.findById(id);
    
    if (trip.creatorId !== userId) {
      throw new ForbiddenException('You can only delete your own trips');
    }
    
    return this.tripRepository.update(id, { status: TripStatus.CANCELLED });
  }

  async requestToJoin(tripId: string, userId: string) {
    const trip = await this.findById(tripId);

    if (trip.creatorId === userId) {
      throw new BadRequestException('You cannot join your own trip');
    }

    if (trip.status !== TripStatus.OPEN) {
      throw new BadRequestException('This trip is not open for joining');
    }

    if (trip.currentParticipants >= trip.maxParticipants) {
      throw new BadRequestException('This trip is already full');
    }

    const existingRequest = await this.participantRepository.findOne({
      where: { tripId, userId },
    });

    if (existingRequest) {
      throw new BadRequestException('You have already requested to join this trip');
    }

    const participant = await this.participantRepository.save({
      tripId,
      userId,
      status: ParticipantStatus.PENDING,
    });

    // Send notification to trip creator
    await this.notificationsService.create({
      userId: trip.creatorId,
      type: 'trip_request',
      title: 'New Trip Request',
      message: `Someone wants to join your trip to ${trip.destination}`,
      data: { tripId, requesterId: userId },
    });

    return participant;
  }

  async handleJoinRequest(
    tripId: string,
    participantUserId: string,
    creatorId: string,
    accept: boolean,
  ) {
    const trip = await this.findById(tripId);

    if (trip.creatorId !== creatorId) {
      throw new ForbiddenException('Only the trip creator can handle join requests');
    }

    const participant = await this.participantRepository.findOne({
      where: { tripId, userId: participantUserId },
    });

    if (!participant) {
      throw new NotFoundException('Join request not found');
    }

    if (participant.status !== ParticipantStatus.PENDING) {
      throw new BadRequestException('This request has already been handled');
    }

    if (accept) {
      if (trip.currentParticipants >= trip.maxParticipants) {
        throw new BadRequestException('Trip is already full');
      }

      participant.status = ParticipantStatus.ACCEPTED;
      await this.participantRepository.save(participant);
      await this.tripRepository.incrementParticipants(tripId);

      // Check if trip is now full
      if (trip.currentParticipants + 1 >= trip.maxParticipants) {
        await this.tripRepository.update(tripId, { status: TripStatus.CLOSED });
      }

      // Notify user
      await this.notificationsService.create({
        userId: participantUserId,
        type: 'trip_accepted',
        title: 'Trip Request Accepted',
        message: `Your request to join the trip to ${trip.destination} has been accepted`,
        data: { tripId },
      });
    } else {
      participant.status = ParticipantStatus.REJECTED;
      await this.participantRepository.save(participant);

      // Notify user
      await this.notificationsService.create({
        userId: participantUserId,
        type: 'trip_rejected',
        title: 'Trip Request Declined',
        message: `Your request to join the trip to ${trip.destination} was declined`,
        data: { tripId },
      });
    }

    return participant;
  }

  async leaveTrip(tripId: string, userId: string) {
    const trip = await this.findById(tripId);

    if (trip.creatorId === userId) {
      throw new BadRequestException('Trip creator cannot leave the trip. Delete the trip instead.');
    }

    const participant = await this.participantRepository.findOne({
      where: { tripId, userId, status: ParticipantStatus.ACCEPTED },
    });

    if (!participant) {
      throw new NotFoundException('You are not a participant of this trip');
    }

    await this.participantRepository.remove(participant);
    await this.tripRepository.decrementParticipants(tripId);

    // Reopen trip if it was closed due to capacity
    if (trip.status === TripStatus.CLOSED) {
      await this.tripRepository.update(tripId, { status: TripStatus.OPEN });
    }

    return { message: 'Successfully left the trip' };
  }

  async getSuggestedMatches(userId: string, nationality?: string) {
    // Simple matching algorithm based on nationality
    // In production, implement more sophisticated matching
    const trips = await this.tripRepository.findOpenTrips();
    
    if (nationality) {
      // Filter trips where creator has same nationality
      // This would require fetching creator details
      return trips;
    }
    
    return trips;
  }
}