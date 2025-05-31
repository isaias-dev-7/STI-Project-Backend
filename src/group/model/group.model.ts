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
import { User } from "src/user/entities/user.entity";
import { UpdateGroupDto } from "../dto/update-group.dto";

@Injectable()
export class GroupModel {
    constructor(
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
        private readonly subjectModel: SubjectModel,
        private readonly userModel: UserModel
    ){}

    async createGroup({key, name, idSubject}: CreateGroupDto, professor: User){
        try {
            const subject = await this.subjectModel.getSubjectById(idSubject);
           
            if(!subject) throw ErrorResponse.build({
                code: 404,
                message: messagesResponse.subjectNotFound
            });
            
            const group = this.groupRepository.create({key, name, subject, user: [professor]});
            await this.groupRepository.save(group);
            return true; 
        } catch (error) {
            this.handleException('createGroup', error);
        }
    }

    async getAllGroup(professorId: number){
        try {
            const groups: Group[] = await this.userModel.getGroupsByUserId(professorId);
            return groups;
        } catch (error) {
            this.handleException('getAllGroup', error);
        }
    }

    async updateGroupById({key, name}: UpdateGroupDto, id: number){
        try {
          await this.groupRepository.update(id, {name, key});
          return true;
        } catch (error) {
            this.handleException('updateGroupById', error);
        }
    }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /group/model/user.model.ts`);
        console.error({error});
        throw error;
    }
}