import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location, LocationType } from '../entities/location.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class LocationRepository extends BaseRepository<Location> {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {
    super(locationRepository);
  }

  async searchByName(query: string): Promise<Location[]> {
    return this.locationRepository
      .createQueryBuilder('location')
      .where('LOWER(location.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .andWhere('location.active = :active', { active: true })
      .getMany();
  }

  async findByType(type: LocationType): Promise<Location[]> {
    return this.locationRepository.find({
      where: { type, active: true },
    });
  }

  async findByBuilding(building: string): Promise<Location[]> {
    return this.locationRepository.find({
      where: { building, active: true },
    });
  }

  async findNearby(
    latitude: number,
    longitude: number,
    radiusInMeters: number,
  ): Promise<Location[]> {
    // Using Haversine formula for distance calculation
    const query = `
      SELECT *, (
        6371000 * acos(
          cos(radians($1)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(latitude))
        )
      ) AS distance
      FROM locations
      WHERE active = true
      HAVING distance < $3
      ORDER BY distance
    `;
    
    return this.locationRepository.query(query, [
      latitude,
      longitude,
      radiusInMeters,
    ]);
  }
}