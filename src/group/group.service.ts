import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UtilsService } from '../utils/utils.service';
import { GroupModel } from './model/group.model';
import { SuccessResponse } from 'src/common/customResponses/successResponse';
import { messagesResponse } from 'src/common/messagesResponse';

@Injectable()
export class GroupService {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly groupModel: GroupModel
  ){}

  async create(createGroupDto: CreateGroupDto) {
    try {
      await this.groupModel.createGroup(createGroupDto);
      return SuccessResponse.build({ message: messagesResponse.groupCreate });
    } catch (error) {
      this.handleException(error);
    }
  }

  findAll() {
    return `This action returns all group`;
  }

  findOne(id: number) {
    return `This action returns a #${id} group`;
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
