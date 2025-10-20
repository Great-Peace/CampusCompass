import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OccupancyStatus, OccupancySource } from '../../../database/entities/occupancy-log.entity';

export class UpdateOccupancyDto {
  @ApiProperty()
  @IsString()
  locationId: string;

  @ApiProperty({ enum: OccupancyStatus })
  @IsEnum(OccupancyStatus)
  status: OccupancyStatus;

  @ApiProperty({ enum: OccupancySource, default: OccupancySource.MANUAL })
  @IsEnum(OccupancySource)
  @IsOptional()
  source?: OccupancySource;
}