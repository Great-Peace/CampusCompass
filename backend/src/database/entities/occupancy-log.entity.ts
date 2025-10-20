import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Location } from './location.entity';
import { User } from './user.entity';

export enum OccupancyStatus {
  FREE = 'free',
  BUSY = 'busy',
  CROWDED = 'crowded',
}

export enum OccupancySource {
  MANUAL = 'manual',
  AUTOMATED = 'automated',
  ADMIN = 'admin',
}

@Entity('occupancy_logs')
export class OccupancyLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'location_id' })
  locationId: string;

  @Column({
    type: 'enum',
    enum: OccupancyStatus,
  })
  status: OccupancyStatus;

  @Column({
    type: 'enum',
    enum: OccupancySource,
    default: OccupancySource.MANUAL,
  })
  source: OccupancySource;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ default: false })
  verified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Location, (location) => location.occupancyLogs)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @ManyToOne(() => User, (user) => user.occupancyLogs)
  @JoinColumn({ name: 'user_id' })
  user: User;
}