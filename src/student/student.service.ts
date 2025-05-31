import { Injectable } from '@nestjs/common';
import { StudentModel } from './model/student.model';
import { UtilsService } from '../utils/utils.service';
import { User } from '../user/entities/user.entity';
import { SuccessResponse } from '../common/customResponses/successResponse';
import { messagesResponse } from '../common/messagesResponse';

@Injectable()
export class StudentService {
    constructor(
        private readonly utilsService: UtilsService,
        private readonly studentModel: StudentModel
    ){}

    async learningStyleStudent(
        user: User,
        learningStyle: string
    ){
        try {
            await this.studentModel.setLearningStyle(user, learningStyle);
            return SuccessResponse.build({ message: messagesResponse.learningStyleAssociated });
        } catch (error) {
            this.handleException('learningStyleStudent', error);
        }
    }

   async getLearningStyle(id: number){
        try {
            const learningStyle = await this.studentModel.getLearningStyleByUserId(id);
            return SuccessResponse.build({ data: { learningStyle }});
        } catch (error) {
            this.handleException('getLearningStyle',error);
        }
   }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - student.service.ts`);
        console.error({ error });
        throw this.utilsService.handleError(error);
      }
}
