import { forwardRef, Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { StudentModel } from './model/student.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    AuthModule,
    UtilsModule
  ],
  controllers: [StudentController],
  providers: [
    StudentService,
    StudentModel
  ],
  exports: [StudentModel]
})
export class StudentModule {}
