import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../core/abstract.entity';
import { Student } from '../../student/entities/student.entity';

@Entity('course')
export class Course extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ManyToOne(() => Student)
  @JoinColumn()
  student: Student;
}
