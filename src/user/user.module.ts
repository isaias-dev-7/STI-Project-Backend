import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserModel } from './model/user.model';
import { UtilsModule } from 'src/utils/utils.module';
import { ProfessorModule } from 'src/professor/professor.module';
import { StudentModule } from 'src/student/student.module';
import { AuthModule } from 'src/auth/auth.module';

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
