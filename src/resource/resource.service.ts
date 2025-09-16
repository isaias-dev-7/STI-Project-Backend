import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { UtilsService } from 'src/utils/utils.service';
import { ResourceModel } from './model/resource.model';
import { ErrorResponse } from 'src/common/customResponses/errorResponse';
import { messagesResponse } from 'src/common/messagesResponse';
import { SuccessResponse } from 'src/common/customResponses/successResponse';
import { User } from 'src/user/entities/user.entity';
import { PaginDto } from 'src/common/dto/paginDto';
import { Response } from 'express';
import * as fs from 'fs-extra';

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

  async findAll(user: User, paginDto: PaginDto) {
    try {
      const {...rest} = await this.resourceModel.getAllResources(user, paginDto);
      return SuccessResponse.build({data: { ...rest }});
    } catch (error) {
      this.handleException(error);
    }
  }

  async findOne(id: number){
    try {
      const resourceDb = await this.resourceModel.getResourceById(id);
      delete resourceDb.url;
      return SuccessResponse.build({data: resourceDb });
    } catch (error) {
      this.handleException(error);
    }
  }

  async update(id: number, updateResourceDto: UpdateResourceDto) {
    try {
       await this.resourceModel.updateResourceById(id, updateResourceDto);
       return SuccessResponse.build({ message: messagesResponse.resourceUpdated });
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: number) {
    try {
      await this.resourceModel.deleteResourceById(id);
      return SuccessResponse.build({ message: messagesResponse.resourceDelete });
    } catch (error) {
      this.handleException(error);
    }
  }

  async getResourceContent(id: number, res: Response){
    try {
      const [fileStat, path] = await this.resourceModel.getContentResourceById(id);
       res.setHeader('Content-Length', fileStat.size);
       res.setHeader('Cache-Control', 'public, max-age=31557600');
       return fs.createReadStream(path).pipe(res);
    } catch (error) {
      return res.status(error.code).json(error);
    }
  }

  private handleException(error: any){
        console.error(`[ERROR] - handleException - resource.service.ts`);
        console.error({ error });
        throw this.utilsService.handleError(error);
      }
}
