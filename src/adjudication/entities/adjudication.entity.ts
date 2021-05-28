import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('adjudication')
export class Adjudication {
  @PrimaryGeneratedColumn()
  traceNumber: number;

  @Column()
  clientId: string;

  @Column()
  planType: string;
}
