import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Spot } from './spot.entity';
import { User } from './user.entity';

export enum ReactionType {
  LIKE = 'like',
  UPVOTE = 'upvote',
}

@Entity('spot_reactions')
@Unique(['spotId', 'userId'])
export class SpotReaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'spot_id' })
  spotId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: ReactionType,
    default: ReactionType.LIKE,
  })
  type: ReactionType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Spot, (spot) => spot.reactions)
  @JoinColumn({ name: 'spot_id' })
  spot: Spot;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}