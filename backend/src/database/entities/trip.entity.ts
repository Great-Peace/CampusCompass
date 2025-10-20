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

export enum TripStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'creator_id' })
  creatorId: string;

  @Column()
  destination: string;

  @Column({ type: 'timestamp', name: 'date_time' })
  dateTime: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.OPEN,
  })
  status: TripStatus;

  @Column({ name: 'max_participants', default: 5 })
  maxParticipants: number;

  @Column({ name: 'current_participants', default: 1 })
  currentParticipants: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.createdTrips)
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => TripParticipant, (participant) => participant.trip)
  participants: TripParticipant[];
}