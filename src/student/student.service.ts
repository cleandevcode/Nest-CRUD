import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { getFromDto } from '../core/utils/repository.util';
import { StudentDto } from './dtos/student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async findStudentById(id: string): Promise<Student> {
    return this.studentRepository.findOne(id);
  }

  async findStudents(): Promise<Student[]> {
    return this.studentRepository.find({ order: { createdAt: 'DESC' } });
  }

  async createStudent(dto: StudentDto): Promise<Student> {
    let student = getFromDto<Student>(dto, new Student());
    student = await this.hashPassword(student);

    const newStudent = await this.studentRepository
      .save(student)
      .catch((err) => {
        throw new InternalServerErrorException('Failed to add student.');
      });
    return this.findStudentById(newStudent.id);
  }

  async updateStudent(id: string, dto: StudentDto): Promise<Student> {
    let student = await this.findStudentById(id).catch((err) => {
      throw new InternalServerErrorException('Failed to load student!');
    });

    student = getFromDto<Student>(dto, student);
    if (dto.password) student = await this.hashPassword(student);

    const updated = await this.studentRepository.save(student).catch((err) => {
      throw new InternalServerErrorException('Failed to update student!');
    });
    return this.findStudentById(updated.id);
  }

  async hashPassword(user: Student): Promise<Student> {
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    return user;
  }
}
