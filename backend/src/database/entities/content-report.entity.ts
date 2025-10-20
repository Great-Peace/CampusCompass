import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ContentType {
  SPOT = 'spot',
  TRIP = 'trip',
  COMMENT = 'comment',
  USER = 'user',
}

export enum ReportStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

@Entity('content_reports')
export class ContentReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ContentType,
  })
  contentType: ContentType;

  @Column({ name: 'content_id' })
  contentId: string;

  @Column({ name: 'reporter_id' })
  reporterId: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @Column({ name: 'admin_notes', type: 'text', nullable: true })
  adminNotes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reporter_id' })
  reporter: User;
}

//   @Column({ name: 'like_count', default: 0 })
//   likeCount: number;

//   @Column({ default: true })
//   active: boolean;

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updatedAt: Date;

//   @ManyToOne(() => User, (user) => user.spots)
//   @JoinColumn({ name: 'user_id' })
//   user: User;

//   @OneToMany(() => SpotReaction, (reaction) => reaction.spot)
//   reactions: SpotReaction[];

//   @OneToMany(() => SpotComment, (comment) => comment.spot)
//   comments: SpotComment[];
// }