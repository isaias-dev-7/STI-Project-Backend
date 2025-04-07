import { forwardRef, Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';
import { ProfessorModel } from './model/professor.model';
import { SubjectModule } from 'src/subject/subject.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Professor]),
    forwardRef(() =>SubjectModule)
  ],
  controllers: [ProfessorController],
  providers: [
    ProfessorService,
    ProfessorModel
  ],
  exports: [ProfessorModel]
})
export class ProfessorModule {}
