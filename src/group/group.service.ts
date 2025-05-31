import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UtilsService } from '../utils/utils.service';
import { GroupModel } from './model/group.model';
import { SuccessResponse } from 'src/common/customResponses/successResponse';
import { messagesResponse } from 'src/common/messagesResponse';
import { User } from 'src/user/entities/user.entity';
import { ErrorResponse } from 'src/common/customResponses/errorResponse';

@Injectable()
export class GroupService {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly groupModel: GroupModel
  ){}

  async create(createGroupDto: CreateGroupDto, professor: User) {
    try {
      await this.groupModel.createGroup(createGroupDto, professor);
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

  remove(id: number) {
    return `This action removes a #${id} group`;
  }

 private handleException(error: any){
    console.error(`[ERROR] - handleException - group.service.ts`);
    console.error({ error });
    throw this.utilsService.handleError(error);
  }
}
