import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Group } from "../entities/group.entity";
import { CreateGroupDto } from "../dto/create-group.dto";
import { SubjectModel } from "../../subject/model/subject.model";
import { ErrorResponse } from "../../common/customResponses/errorResponse";
import { messagesResponse } from "../../common/messagesResponse";

@Injectable()
export class GroupModel {
    constructor(
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
        private readonly subjectModel: SubjectModel
    ){}

    async createGroup({key, name, idSubject}: CreateGroupDto){
        try {
            const subject = await this.subjectModel.getSubjectById(idSubject);
            if(!subject) throw ErrorResponse.build({
                code: 404,
                message: messagesResponse.subjectNotFound
            });

            const group = this.groupRepository.create({key, name, subject});
            await this.groupRepository.save(group);
            return true; 
        } catch (error) {
            this.handleException('createGroup', error);
        }
    }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /group/model/user.model.ts`);
        console.error({error});
        throw error;
    }
}