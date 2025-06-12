import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Group } from "../entities/group.entity";
import { CreateGroupDto } from "../dto/create-group.dto";
import { SubjectModel } from "../../subject/model/subject.model";
import { ErrorResponse } from "../../common/customResponses/errorResponse";
import { messagesResponse } from "../../common/messagesResponse";
import { UserModel } from "src/user/model/user.model";
import { User } from "src/user/entities/user.entity";
import { UpdateGroupDto } from "../dto/update-group.dto";

@Injectable()
export class GroupModel {
    constructor(
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
        private readonly subjectModel: SubjectModel,
        private readonly userModel: UserModel
    ){}

    async createGroup({key, name}: CreateGroupDto, user: User){
        try {
            const { professor } = await this.userModel.getUserbyId(user.id);
            const subject = await this.subjectModel.getSubjectByProfessor(professor);
           
            if(!subject) throw ErrorResponse.build({
                code: 404,
                message: messagesResponse.subjectNotFound
            });
            
            const group = this.groupRepository.create({key, name, subject, user: [user]});
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

    async getGroupById(id: number){
        try {
            const group = await this.groupRepository.findOneBy({id});
            if(!group) throw ErrorResponse.build({ code: 404, message: messagesResponse.groupNotFound });
            return group;
        } catch (error) {
            this.handleException('getGroupById',error);
        }
    }

    async deleteGroupById(id: number){
        try {
            await this.getGroupById(id);
            await this.groupRepository.delete(id);
            return true;
        } catch (error) {
            this.handleException('deleteGroupById', error);
        }
    }

    async enrollStudentByKey(key: string, user: User){
        try {
            const group = await this.groupRepository.findOne({
                where: { key },
                relations: ['user']
            });
            if(!group) throw ErrorResponse.build({
                code: 400,
                message: messagesResponse.invalidKey
            });
            group.user = [...group.user, user];
            await this.groupRepository.save(group);
            return true;
        } catch (error) {
            this.handleException('enrollStudentBykey', error);
        }
    }

    async isEnrolled(subjectId: number, user: User){
        try {
            const subject = await this.subjectModel.getSubjectById(subjectId);
            const group = await this.groupRepository.findOne({
                where: {
                    user: { id: user.id },
                    subject
                },
                relations: ["user", "subject"]
            });

            return group ? true : false;
        } catch (error) {
            this.handleException('isEnrolled', error);
        }
    }

    async getStudentsByGrupoId(id: number, user: User){
        try {
            await this.getGroupById(id);
            const { user: users } = await this.groupRepository.findOne({
                where: { id },
                relations: ["user"]
            });
            
            return users.filter(u => u.id != user.id);
        } catch (error) {
            this.handleException('getStudentsByGrupoId', error);
        }
    }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /group/model/user.model.ts`);
        console.error({error});
        throw error;
    }
}