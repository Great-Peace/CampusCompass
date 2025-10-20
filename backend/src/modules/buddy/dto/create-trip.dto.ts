import { IsString, IsDateString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTripDto {
  @ApiProperty()
  @IsString()
  destination: string;

  @ApiProperty()
  @IsDateString()
  dateTime: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ default: 5, minimum: 2, maximum: 10 })
  @IsNumber()
  @Min(2)
  @Max(10)
  @IsOptional()
  maxParticipants?: number;
}