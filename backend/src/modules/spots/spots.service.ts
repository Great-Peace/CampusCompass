import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpotRepository } from '../../database/repositories/spot.repository';
import { SpotReaction } from '../../database/entities/spot-reaction.entity';
import { SpotComment } from '../../database/entities/spot-comment.entity';
import { CreateSpotDto } from './dto/create-spot.dto';
import { CommentSpotDto } from './dto/comment-spot.dto';
import { SpotCategory } from '../../database/entities/spot.entity';

@Injectable()
export class SpotsService {
  constructor(
    private readonly spotRepository: SpotRepository,
    @InjectRepository(SpotReaction)
    private readonly spotReactionRepository: Repository<SpotReaction>,
    @InjectRepository(SpotComment)
    private readonly spotCommentRepository: Repository<SpotComment>,
  ) {}

  async findAll(category?: SpotCategory) {
    return this.spotRepository.findAllActive(category);
  }

  async findById(id: string) {
    const spot = await this.spotRepository.findById(id);
    
    if (!spot || !spot.active) {
      throw new NotFoundException('Spot not found');
    }
    
    return spot;
  }

  async create(userId: string, createSpotDto: CreateSpotDto) {
    return this.spotRepository.create({
      ...createSpotDto,
      userId,
    });
  }

  async update(id: string, userId: string, updateData: Partial<CreateSpotDto>) {
    const spot = await this.findById(id);
    
    if (spot.userId !== userId) {
      throw new ForbiddenException('You can only update your own spots');
    }
    
    return this.spotRepository.update(id, updateData);
  }

  async delete(id: string, userId: string) {
    const spot = await this.findById(id);
    
    if (spot.userId !== userId) {
      throw new ForbiddenException('You can only delete your own spots');
    }
    
    return this.spotRepository.update(id, { active: false });
  }

  async toggleReaction(spotId: string, userId: string) {
    const spot = await this.findById(spotId);

    const existingReaction = await this.spotReactionRepository.findOne({
      where: { spotId, userId },
    });

    if (existingReaction) {
      await this.spotReactionRepository.remove(existingReaction);
      await this.spotRepository.decrementLikeCount(spotId);
      return { liked: false };
    } else {
      await this.spotReactionRepository.save({
        spotId,
        userId,
      });
      await this.spotRepository.incrementLikeCount(spotId);
      return { liked: true };
    }
  }

  async addComment(spotId: string, userId: string, commentDto: CommentSpotDto) {
    await this.findById(spotId);

    const comment = await this.spotCommentRepository.save({
      spotId,
      userId,
      content: commentDto.content,
    });

    return comment;
  }

  async getComments(spotId: string) {
    return this.spotCommentRepository.find({
      where: { spotId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}