import { Module } from '@nestjs/common';
import { LearningPathService } from './learning-path.service';
import { LearningPathController } from './learning-path.controller';
import { UtilsModule } from '../utils/utils.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningPath } from './entities/learning-path.entity';
import { UserModule } from '../user/user.module';
import { ResourceModule } from '../resource/resource.module';
import { LearningPathModel } from './model/learning-path.model';
import { SubjectModule } from '../subject/subject.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LearningPath]),
    UtilsModule,
    AuthModule,
    UserModule,
    SubjectModule,
    ResourceModule
  ],
  controllers: [LearningPathController],
  providers: [
    LearningPathModel,
    LearningPathService
  ],
  exports: [LearningPathModel]
})
export class LearningPathModule {}
