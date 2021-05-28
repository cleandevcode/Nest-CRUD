import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as OrmConfig from './orm.config';

import { AppController } from './app.controller';
import { StudentModule } from './student/student.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [TypeOrmModule.forRoot(OrmConfig), StudentModule, CourseModule],
  controllers: [AppController],
})
export class AppModule {}
