import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('spot_comments')
export class SpotComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'spot_id' })
  spotId: string;

  @Column({ name: 'user_id' })
  userId: string;
}