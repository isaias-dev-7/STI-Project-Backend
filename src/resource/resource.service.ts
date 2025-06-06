import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { UtilsService } from 'src/utils/utils.service';
import { ResourceModel } from './model/resource.model';
import { ErrorResponse } from 'src/common/customResponses/errorResponse';
import { messagesResponse } from 'src/common/messagesResponse';
import { SuccessResponse } from 'src/common/customResponses/successResponse';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ResourceService {
  constructor(
    private readonly resourceModel: ResourceModel,
    private readonly utilsService: UtilsService
  ){}

  async create(
    file: Express.Multer.File, 
    createResourceDto: CreateResourceDto,
    user: User
  ) {
    try {
      if(!file) throw ErrorResponse.build({ code: 404, message: messagesResponse.fieldFileRequired });
      await this.resourceModel.createResource(file, createResourceDto, user);
      return SuccessResponse.build({ message: messagesResponse.resourceCreated });
    } catch (error) {
      this.handleException(error);
    }
  }

  findAll() {
    return `This action returns all resource`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resource`;
  }

  update(id: number, updateResourceDto: UpdateResourceDto) {
    return `This action updates a #${id} resource`;
  }

  remove(id: number) {
    return `This action removes a #${id} resource`;
  }

  private handleException(error: any){
        console.error(`[ERROR] - handleException - resource.service.ts`);
        console.error({ error });
        throw this.utilsService.handleError(error);
      }
}
