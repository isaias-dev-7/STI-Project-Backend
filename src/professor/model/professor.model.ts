import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Professor } from "../entities/professor.entity";
import { Repository } from "typeorm";
import { CreateProfessorDto } from "../dto/create-professor.dto";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class ProfessorModel {
    constructor(
        @InjectRepository(Professor) private readonly professorRepository: Repository<Professor>
    ){}

    async createProfessor(
        {...rest}: CreateProfessorDto,
        user: User
    ){
        try {
            const professor = this.professorRepository.create({user, ...rest});
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