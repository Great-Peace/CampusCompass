import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinTripDto {
  @ApiProperty()
  @IsString()
  tripId: string;
}