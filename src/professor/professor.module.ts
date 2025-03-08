import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';
import { ProfessorModel } from './model/professor.model';

@Module({
  imports:[
    TypeOrmModule.forFeature([Professor])
  ],
  controllers: [ProfessorController],
  providers: [
    ProfessorService,
    ProfessorModel
  ],
  exports: [ProfessorModel]
})
export class ProfessorModule {}
