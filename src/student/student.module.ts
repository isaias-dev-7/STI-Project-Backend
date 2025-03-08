import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { StudentModel } from './model/student.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student])
  ],
  controllers: [StudentController],
  providers: [
    StudentService,
    StudentModel
  ],
  exports: [StudentModel]
})
export class StudentModule {}
