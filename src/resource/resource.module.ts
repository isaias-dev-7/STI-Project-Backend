import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from '../utils/utils.module';
import { ResourceModel } from './model/resource.model';
import { SessionModule } from 'src/session/session.module';
import { UserModule } from 'src/user/user.module';
import { SubjectModule } from 'src/subject/subject.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource]),
    AuthModule,
    UtilsModule,
    SessionModule,
    UserModule,
    SubjectModule
  ],
  controllers: [ResourceController],
  providers: [
    ResourceModel,
    ResourceService
  ],
  exports: [ResourceModel]
})
export class ResourceModule {}
