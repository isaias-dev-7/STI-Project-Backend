import { forwardRef, Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { AuthModule } from 'src/auth/auth.module';
import { GroupModel } from './model/group.model';
import { SubjectModule } from 'src/subject/subject.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group]),
    UtilsModule,
    AuthModule,
    SubjectModule
  ],
  controllers: [GroupController],
  providers: [
    GroupModel,
    GroupService
  ],
  exports: [GroupModel]
})
export class GroupModule {}
