import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Company } from '../company/company.entity';
import { Domain } from '../domain/domain.entity';

@Entity('api_requests')
export class APIRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  endpoint: string;

  @Column({ type: 'text' })
  parameters: string;

  @ManyToOne(() => Company, (company) => company.requests, { nullable: false })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Domain, (domain) => domain.requests, { nullable: false })
  @JoinColumn({ name: 'domain_id' })
  domain: Domain;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
