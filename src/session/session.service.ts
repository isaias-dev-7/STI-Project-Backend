import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { UtilsService } from '../utils/utils.service';
import { SessionModel } from './model/session.model';
import { SuccessResponse } from 'src/common/customResponses/successResponse';
import { messagesResponse } from 'src/common/messagesResponse';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SessionService {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly sessionModel: SessionModel
  ){}

  async create(createSessionDto: CreateSessionDto, user: User) {
    try {
      await this.sessionModel.createSession(createSessionDto, user);
      return SuccessResponse.build({ message: messagesResponse.sessionCreated });
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll(user: User) {
    try {
      const sessions = await this.sessionModel.getAllSession(user);
      return SuccessResponse.build({ data: sessions });
    } catch (error) {
      this.handleException(error);
    }
  }

  async update(
    id: number,
    updateSessionDto: UpdateSessionDto
  ) {
    try {
      await this.sessionModel.updateSessionById(id, updateSessionDto);
      return SuccessResponse.build({ message: messagesResponse.sessionUpdated });
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: number) {
    try {
      await this.sessionModel.deleteSessioById(id);
      return SuccessResponse.build({ message: messagesResponse.sessionDelete });
    } catch (error) {
      this.handleException(error);
    }
  }

  async assingResourcesByIds(idSession: number, ids: Number[]){
    try {
      await this.sessionModel.assingResources(idSession, ids);
      return SuccessResponse.build({message: messagesResponse.resourcesAssing });
    } catch (error) {
      this.handleException(error);
    }
  }

 private handleException(error: any){
        console.error(`[ERROR] - handleException - session.service.ts`);
        console.error({ error });
        throw this.utilsService.handleError(error);
      }
}
