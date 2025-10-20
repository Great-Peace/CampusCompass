import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spot } from '../../database/entities/spot.entity';
import { SpotReaction } from '../../database/entities/spot-reaction.entity';
import { SpotComment } from '../../database/entities/spot-comment.entity';
import { SpotRepository } from '../../database/repositories/spot.repository';
import { SpotsService } from './spots.service';
import { SpotsController } from './spots.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Spot, SpotReaction, SpotComment])],
  controllers: [SpotsController],
  providers: [SpotsService, SpotRepository],
  exports: [SpotsService],
})
export class SpotsModule {}