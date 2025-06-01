import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { AuthModule } from 'src/auth/auth.module';
import { SubjectModule } from 'src/subject/subject.module';
import { SessionModel } from './model/session.model';

@Module({
  imports:[
    TypeOrmModule.forFeature([Session]),
    UtilsModule,
    AuthModule,
    SubjectModule
  ],
  controllers: [SessionController],
  providers: [
    SessionModel,
    SessionService
  ],
  exports: [SessionModel]
})
export class SessionModule {}
