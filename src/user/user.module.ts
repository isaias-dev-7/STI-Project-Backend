import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserModel } from './model/user.model';
import { UtilsModule } from '../utils/utils.module';
import { ProfessorModule } from '../professor/professor.module';
import { StudentModule } from '../student/student.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UtilsModule,
    ProfessorModule,
    StudentModule, 
    AuthModule
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserModel
  ],
  exports: [UserModel]
})
export class UserModule {}
