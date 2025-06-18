import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { UtilsModule } from '../utils/utils.module';
import { AuthModule } from '../auth/auth.module';
import { SubjectModule } from '../subject/subject.module';
import { SessionModel } from './model/session.model';
import { UserModule } from '../user/user.module';
import { ResourceModule } from '../resource/resource.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Session]),
    UtilsModule,
    AuthModule,
    SubjectModule,
    UserModule,
    ResourceModule
  ],
  controllers: [SessionController],
  providers: [
    SessionModel,
    SessionService
  ],
  exports: [SessionModel]
})
export class SessionModule {}
