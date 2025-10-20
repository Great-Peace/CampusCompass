import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OccupancyLog } from './occupancy-log.entity';

export enum LocationType {
  CLASSROOM = 'classroom',
  OFFICE = 'office',
  LIBRARY = 'library',
  CAFETERIA = 'cafeteria',
  STUDY_ROOM = 'study_room',
  LAB = 'lab',
  AUDITORIUM = 'auditorium',
  COMMON_AREA = 'common_area',
  OUTDOOR = 'outdoor',
  OTHER = 'other',
}

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: LocationType,
  })
  type: LocationType;

  @Column()
  building: string;

  @Column({ nullable: true })
  floor: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => OccupancyLog, (log) => log.location)
  occupancyLogs: OccupancyLog[];
}