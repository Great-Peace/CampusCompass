import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SuspendUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}