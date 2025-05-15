import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500, nullable: false })
  path: string;

  @Column({ type: 'bigint', nullable: true })
  size?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mimetype?: string;

  @ManyToOne(() => User, (user) => user.files, {
    nullable: true,
  })
  updatedBy?: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
