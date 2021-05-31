import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getFromDto } from '../core/utils/repository.util';
import { StudentService } from '../student/student.service';
import { CourseDto } from './dtos/course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private studentService: StudentService,
  ) {}

  async findCourseById(id: string): Promise<Course> {
    return this.courseRepository.findOne({
      relations: ['student'],
      where: { id },
    });
  }

  async createCourse(id: string, data: CourseDto): Promise<Course> {
    const course = getFromDto<Course>(data, new Course());
    const student = await this.studentService.findStudentById(id);

    course.student = student;

    const newCourse = await this.courseRepository.save(course).catch((err) => {
      throw new InternalServerErrorException('Failed to create new course!');
    });

    return this.findCourseById(newCourse.id);
  }

  async findCoursesByStudent(studentId: string): Promise<Course[]> {
    return this.courseRepository.find({
      relations: ['student'],
      where: { student: { id: studentId } },
    });
  }
}
