import { Injectable, NotFoundException } from '@nestjs/common';
import { LocationRepository } from '../../database/repositories/location.repository';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationType } from '../../database/entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(private readonly locationRepository: LocationRepository) {}

  async findAll() {
    return this.locationRepository.findAll({
      where: { active: true },
      order: { name: 'ASC' },
    });
  }

  async findById(id: string) {
    const location = await this.locationRepository.findById(id);
    
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    
    return location;
  }

  async search(query: string) {
    return this.locationRepository.searchByName(query);
  }

  async findByType(type: LocationType) {
    return this.locationRepository.findByType(type);
  }

  async findNearby(latitude: number, longitude: number, radius: number = 500) {
    return this.locationRepository.findNearby(latitude, longitude, radius);
  }

  async create(createLocationDto: CreateLocationDto) {
    return this.locationRepository.create(createLocationDto);
  }

  async update(id: string, updateData: Partial<CreateLocationDto>) {
    const location = await this.findById(id);
    return this.locationRepository.update(location.id, updateData);
  }

  async delete(id: string) {
    const location = await this.findById(id);
    return this.locationRepository.delete(location.id);
  }

  async calculateRoute(fromId: string, toId: string) {
    const from = await this.findById(fromId);
    const to = await this.findById(toId);

    // Simple straight-line distance calculation
    // In production, use a proper routing algorithm or service
    const distance = this.calculateDistance(
      from.latitude,
      from.longitude,
      to.latitude,
      to.longitude,
    );

    return {
      from: from,
      to: to,
      distance: distance,
      estimatedTime: Math.ceil(distance / 1.4), // Assuming 1.4 m/s walking speed
      // In production, return actual route coordinates
      route: [
        { lat: Number(from.latitude), lng: Number(from.longitude) },
        { lat: Number(to.latitude), lng: Number(to.longitude) },
      ],
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}