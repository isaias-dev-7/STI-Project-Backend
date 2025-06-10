import { Injectable } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { LearningPathModel } from './model/learning-path.model';
import { User } from '../user/entities/user.entity';
import { SuccessResponse } from 'src/common/customResponses/successResponse';

@Injectable()
export class LearningPathService {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly learningPathModel: LearningPathModel
  ){}

  async createPath(user: User, subjectId: number){
    try {
     const {...rest} = await this.learningPathModel.buildingPath(user, subjectId);
      return SuccessResponse.build({data: {...rest}});
    } catch (error) {
      this.handleException(error);
    }
  }

  private handleException(error: any){
        console.error(`[ERROR] - handleException - learning-path.service.ts`);
        console.error({ error });
        throw this.utilsService.handleError(error);
      }
}
