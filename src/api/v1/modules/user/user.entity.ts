import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { hashPassword } from '../../utils';
import { Role } from '../role/role.entity';
import { Company } from '../company/company.entity';
import { UserToken } from '../tokens/tokens.entity';
import { UserLoginHistory } from '../histories/histories.entity';
import { Request } from '../request/request.entity';
import { File } from '../file/file.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true, nullable: false })
  @JoinColumn()
  role: Role;

  @ManyToOne(() => Company, (company) => company.users, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  company: Company;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserToken, (token) => token.user, {
    nullable: true,
    cascade: true,
  })
  userTokens: UserToken[];

  @OneToMany(() => UserLoginHistory, (history) => history.user, {
    nullable: true,
    cascade: true,
  })
  loginHistories: UserLoginHistory[];

  @OneToMany(() => File, (files) => files.updatedBy, {
    nullable: true,
    cascade: true,
  })
  files: UserLoginHistory[];

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
  }
}
