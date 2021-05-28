import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { isEmail, isEmpty, isMobilePhone, isUUID } from 'class-validator';
import { StudentDto } from './dtos/student.dto';
import { Student } from './entities/student.entity';
import { StudentService } from './student.service';

@Controller()
@ApiTags('Students')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get('/students')
  @ApiOkResponse({ type: [Student] })
  async getStudents(@Request() request): Promise<Student[]> {
    return this.studentService.findStudents();
  }

  @Post('/students')
  @ApiOkResponse({ type: Student })
  async addStudent(
    @Request() request,
    @Body() body: StudentDto,
  ): Promise<Student> {
    if (isEmpty(body.firstName))
      throw new BadRequestException('First name required!');
    if (isEmpty(body.lastName))
      throw new BadRequestException('Last name required!');
    if (isEmpty(body.email)) throw new BadRequestException('email required!');
    if (!isEmail(body.email)) throw new BadRequestException('invalid email!');
    if (body.mobileNumber && !isMobilePhone(body.mobileNumber))
      throw new BadRequestException('invalid mobile number!');
    if (isEmpty(body.password))
      throw new BadRequestException('password required!');

    return this.studentService.createStudent(body);
  }

  @Get('/students/:id')
  @ApiOkResponse({ type: Student })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    example: '4c6ce9a7-77ee-4249-8fea-1ac405f2101a',
  })
  async getStudentById(
    @Request() request,
    @Param('id') id: string,
  ): Promise<Student> {
    if (isEmpty(id)) throw new BadRequestException('id required!');
    if (!isUUID(id)) throw new BadRequestException('Invalid uuid!');

    const student = await this.studentService
      .findStudentById(id)
      .catch((err) => {
        throw new InternalServerErrorException('Faild to load student!');
      });

    if (!student) throw new BadRequestException('Non-existing student id!');

    return student;
  }

  @Put('/students/:id')
  @ApiOkResponse({ type: Student })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    example: '4c6ce9a7-77ee-4249-8fea-1ac405f2101a',
  })
  async updateStudent(
    @Request() request,
    @Param('id') id: string,
    @Body() body: StudentDto,
  ): Promise<Student> {
    if (isEmpty(id)) throw new BadRequestException('id required!');
    if (!isUUID(id)) throw new BadRequestException('invalid student id!');

    if (body.email && !isEmail(body.email))
      throw new BadRequestException('invalid email!');

    if (body.mobileNumber && !isMobilePhone(body.mobileNumber))
      throw new BadRequestException('Invalid mobile number!');

    const student = await this.studentService.findStudentById(id);
    if (!student) throw new BadRequestException('Non-existing student id!');

    return this.studentService.updateStudent(id, body);
  }
}
