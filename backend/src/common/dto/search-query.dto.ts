import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchQueryDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  q?: string;
}