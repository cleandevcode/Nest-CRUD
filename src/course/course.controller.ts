import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { isEmpty, isUUID } from 'class-validator';
import { StudentService } from 'src/student/student.service';
import { CourseService } from './course.service';
import { CourseDto } from './dtos/course.dto';
import { Course } from './entities/course.entity';

@Controller('course')
export class CourseController {
  constructor(
    private courseService: CourseService,
    private studentService: StudentService,
  ) {}

  @Get('/student/:id/course')
  @ApiOkResponse({ type: [Course] })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    example: 'eeb268ac-8765-48cc-b090-fcad143482d0',
  })
  async getCoursesByStudent(
    @Request() request,
    @Param('id') id: string,
  ): Promise<Course[]> {
    if (isEmpty(id)) throw new BadRequestException('student id required!');
    if (!isUUID(id)) throw new BadRequestException('invalid student id!');
    const student = await this.studentService
      .findStudentById(id)
      .catch((err) => {
        throw new InternalServerErrorException('Failed to load student!');
      });
    if (!student) throw new BadRequestException('Non-existing student id!');

    return this.courseService.findCoursesByStudent(id);
  }

  @Post('/student/:id/course')
  @ApiOkResponse({ type: Course })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    example: '4c6ce9a7-77ee-4249-8fea-1ac405f2101',
  })
  async addCourse(
    @Request() request,
    @Param('id') id: string,
    @Body() body: CourseDto,
  ): Promise<Course> {
    if (isEmpty(id)) throw new BadRequestException('student id required!');
    if (!isUUID(id)) throw new BadRequestException('invalid student id!');
    const student = await this.studentService
      .findStudentById(id)
      .catch((err) => {
        throw new InternalServerErrorException('Failed to load student!');
      });
    if (!student) throw new BadRequestException('Non-existing student id!');

    return this.courseService.createCourse(id, body);
  }
}
