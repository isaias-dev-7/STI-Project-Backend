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
import { Chat } from './chatbot/entities/chat.entity';
import { SeedModule } from './seed/seed.module';
import { GroupModule } from './group/group.module';
import { Group } from './group/entities/group.entity';
import { SessionModule } from './session/session.module';
import { Session } from './session/entities/session.entity';
import { ResourceModule } from './resource/resource.module';
import { Resource } from './resource/entities/resource.entity';
import { LearningPathModule } from './learning-path/learning-path.module';
import { LearningPath } from './learning-path/entities/learning-path.entity';

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
        Subject,
        Chat, 
        Group,
        Session,
        Resource,
        LearningPath
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
    ChatbotModule,
    SeedModule,
    GroupModule,
    SessionModule,
    ResourceModule,
    LearningPathModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
