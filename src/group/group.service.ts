import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UtilsService } from '../utils/utils.service';
import { GroupModel } from './model/group.model';
import { SuccessResponse } from 'src/common/customResponses/successResponse';
import { messagesResponse } from 'src/common/messagesResponse';
import { User } from 'src/user/entities/user.entity';
import { ErrorResponse } from 'src/common/customResponses/errorResponse';
import { EnrollGroupDto } from './dto/enrroll-group.dto';

@Injectable()
export class GroupService {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly groupModel: GroupModel
  ){}

  async create(createGroupDto: CreateGroupDto, user: User) {
    try {
      await this.groupModel.createGroup(createGroupDto, user);
      return SuccessResponse.build({ message: messagesResponse.groupCreate });
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll({ id }: User) {
    try {
       const groups = await this.groupModel.getAllGroup(id);
       return SuccessResponse.build({data: groups});
    } catch (error) {
       this.handleException(error);
    }
  }

  
  async update(id: number, updateGroupDto: UpdateGroupDto) {
    try {
      if(!updateGroupDto.key && !updateGroupDto.name) throw ErrorResponse.build({code: 400});
      await this.groupModel.updateGroupById(updateGroupDto, id);
      return SuccessResponse.build({ message: messagesResponse.groupUpdated });
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: number) {
    try {
      await this.groupModel.deleteGroupById(id);
      return SuccessResponse.build({ message: messagesResponse.groupDelete });
    } catch (error) {
      this.handleException(error);
    }
  }

  async enrollStudent({ key }: EnrollGroupDto, user: User){
    try {
      await this.groupModel.enrollStudentByKey(key, user);
      return SuccessResponse.build({message: messagesResponse.enrolled });
    } catch (error) {
      this.handleException(error);
    }
  }

  async isStudentEnrolled(subjectId: number, user: User){
    try {
      const flag = await this.groupModel.isEnrolled(subjectId, user);
      return SuccessResponse.build({ data: { isEnroled: flag } });
    } catch (error) {
      this.handleException(error);
    }
  }

  async getUsers(id: number, user: User){
    try {
       const users = await this.groupModel.getStudentsByGrupoId(id, user);
       return SuccessResponse.build({data: users});
    } catch (error) {
      this.handleException(error);
    }
  }

 private handleException(error: any){
    console.error(`[ERROR] - handleException - group.service.ts`);
    console.error({ error });
    throw this.utilsService.handleError(error);
  }
}
