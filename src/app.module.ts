import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { CommonModule } from './common/common.module';
import { UtilsModule } from './utils/utils.module';
import { StudentModule } from './student/student.module';
import { Student } from './student/entities/student.entity';
import { ProfessorModule } from './professor/professor.module';
import { Professor } from './professor/entities/professor.entity';
import { AuthModule } from './auth/auth.module';
import { SubjectModule } from './subject/subject.module';
import { Subject } from './subject/entities/subject.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HttpServiceModule } from './http-service/http-service.module';
import { ChatbotModule } from './chatbot/chatbot.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../uploads'),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [
        User,
        Student,
        Professor,
        Subject
      ],
      synchronize: true
    }),
    UserModule,
    CommonModule,
    UtilsModule,
    StudentModule,
    ProfessorModule,
    AuthModule,
    SubjectModule,
    HttpServiceModule,
    ChatbotModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
