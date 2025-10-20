import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SpotCategory } from '../../../database/entities/spot.entity';

export class CreateSpotDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: SpotCategory })
  @IsEnum(SpotCategory)
  category: SpotCategory;

  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}