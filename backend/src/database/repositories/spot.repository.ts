import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spot, SpotCategory } from '../entities/spot.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class SpotRepository extends BaseRepository<Spot> {
  constructor(
    @InjectRepository(Spot)
    private readonly spotRepository: Repository<Spot>,
  ) {
    super(spotRepository);
  }

  async findAllActive(category?: SpotCategory): Promise<Spot[]> {
    const query = this.spotRepository
      .createQueryBuilder('spot')
      .leftJoinAndSelect('spot.user', 'user')
      .where('spot.active = :active', { active: true });

    if (category) {
      query.andWhere('spot.category = :category', { category });
    }

    return query
      .orderBy('spot.likeCount', 'DESC')
      .addOrderBy('spot.createdAt', 'DESC')
      .getMany();
  }

  async findByUser(userId: string): Promise<Spot[]> {
    return this.spotRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async incrementLikeCount(spotId: string): Promise<void> {
    await this.spotRepository.increment({ id: spotId }, 'likeCount', 1);
  }

  async decrementLikeCount(spotId: string): Promise<void> {
    await this.spotRepository.decrement({ id: spotId }, 'likeCount', 1);
  }

  async searchSpots(query: string): Promise<Spot[]> {
    return this.spotRepository
      .createQueryBuilder('spot')
      .where('LOWER(spot.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(spot.description) LIKE LOWER(:query)', { query: `%${query}%` })
      .andWhere('spot.active = :active', { active: true })
      .orderBy('spot.likeCount', 'DESC')
      .getMany();
  }
}