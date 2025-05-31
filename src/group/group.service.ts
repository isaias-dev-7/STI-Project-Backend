import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UtilsService } from '../utils/utils.service';
import { GroupModel } from './model/group.model';
import { SuccessResponse } from 'src/common/customResponses/successResponse';
import { messagesResponse } from 'src/common/messagesResponse';
import { User } from 'src/user/entities/user.entity';

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

  
  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
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
