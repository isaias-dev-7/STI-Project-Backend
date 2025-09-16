import { forwardRef, Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { SubjectModel } from './model/subject.model';
import { UtilsModule } from '../utils/utils.module';
import { AuthModule } from '../auth/auth.module';
import { ProfessorModule } from '../professor/professor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subject]),
    UtilsModule,
    AuthModule,
    forwardRef(() => ProfessorModule)
  ],
  controllers: [SubjectController],
  providers: [
    SubjectModel,
    SubjectService
  ],
  exports: [SubjectModel]
})
export class SubjectModule {}
