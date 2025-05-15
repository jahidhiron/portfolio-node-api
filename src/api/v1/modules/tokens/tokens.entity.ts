import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('user_tokens')
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({
    type: 'enum',
    enum: ['account_verification', 'reset_password'],
  })
  type: 'account_verification' | 'reset_password';

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  expiredAt: Date;

  @ManyToOne(() => User, (user) => user.userTokens, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: number;
}
