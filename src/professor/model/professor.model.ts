import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Professor } from "../entities/professor.entity";
import { Repository } from "typeorm";
import { CreateProfessorDto } from "../dto/create-professor.dto";
import { User } from "src/user/entities/user.entity";
import { SubjectModel } from "src/subject/model/subject.model";

@Injectable()
export class ProfessorModel {
    constructor(
        @InjectRepository(Professor) private readonly professorRepository: Repository<Professor>,
        private readonly subjectModel: SubjectModel,
    ){}

    async createProfessor(
        {subject, ...rest}: CreateProfessorDto,
        user: User
    ){
        try {
            const subjectDb = await this.subjectModel.getSubjectById(subject);
            const professor = this.professorRepository.create({user, subject: subjectDb, ...rest});
            await this.professorRepository.save(professor);
            return true;
        } catch (error) {
            this.handleException('createProfessor', error);
        }
    }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /professor/model/professor.model.ts`);
        console.error({error});
        throw error;
    }
}