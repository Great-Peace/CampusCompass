import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { SpotReaction } from './spot-reaction.entity';
import { SpotComment } from './spot-comment.entity';

export enum SpotCategory {
  FOOD = 'food',
  GYM = 'gym',
  STUDY = 'study',
  SHOPPING = 'shopping',
  ENTERTAINMENT = 'entertainment',
  HEALTH = 'health',
  OTHER = 'other',
}

@Entity('spots')
export class Spot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: SpotCategory,
  })
  category: SpotCategory;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => SpotReaction, (reaction) => reaction.spot)
  reactions: SpotReaction[];
  
  @OneToMany(() => SpotComment, (comment) => comment.spot)
  comments: SpotComment[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}