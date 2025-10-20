import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TripStatus } from '../../../database/entities/trip.entity';

export class UpdateTripDto {
  @ApiProperty({ enum: TripStatus, required: false })
  @IsEnum(TripStatus)
  @IsOptional()
  status?: TripStatus;
}