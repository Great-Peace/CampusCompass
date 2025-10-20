import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Spot } from './spot.entity';
import { User } from './user.entity';

@Entity('spot_comments')
export class SpotComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'spot_id' })
  spotId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Spot, (spot) => spot.comments)
  @JoinColumn({ name: 'spot_id' })
  spot: Spot;

  @ManyToOne(() => User, (user) => user.createdTrips)
  @JoinColumn({ name: 'user_id' })
  user: User;
}