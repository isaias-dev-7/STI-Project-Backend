import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Group } from "../entities/group.entity";
import { CreateGroupDto } from "../dto/create-group.dto";
import { SubjectModel } from "../../subject/model/subject.model";
import { ErrorResponse } from "../../common/customResponses/errorResponse";
import { messagesResponse } from "../../common/messagesResponse";
import { UserModel } from "src/user/model/user.model";
import { roleEnum } from "src/common/enums/roleEnum";

@Injectable()
export class GroupModel {
    constructor(
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
        private readonly subjectModel: SubjectModel,
        private readonly userModel: UserModel
    ){}

    async createGroup({key, name, idSubject, idProfessor}: CreateGroupDto){
        try {
            const subject = await this.subjectModel.getSubjectById(idSubject);
            const professor = await this.userModel.getUserbyId(idProfessor);
           
            if(!subject) throw ErrorResponse.build({
                code: 404,
                message: messagesResponse.subjectNotFound
            });
            
            if(!professor) throw ErrorResponse.build({
                code: 404,
                message: messagesResponse.userNotFound
            });

            if(professor.role != roleEnum.PROFESSOR_AUXILIAR || professor.role != roleEnum.PROFESSOR_AUXILIAR)
                throw ErrorResponse.build({code: 401, message: messagesResponse.incorrectCredentials })

            const group = this.groupRepository.create({key, name, subject, user: [professor]});
            await this.groupRepository.save(group);
            return true; 
        } catch (error) {
            this.handleException('createGroup', error);
        }
    }

    async getAllGroup(professorId: number){
        try {
            const user = null;
            const groups: Group [] = await this.groupRepository.
        } catch (error) {
            this.handleException('getAllGroup', error);
        }
    }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /group/model/user.model.ts`);
        console.error({error});
        throw error;
    }
}