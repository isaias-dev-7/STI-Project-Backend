import { Injectable } from '@nestjs/common';
import { StudentModel } from './model/student.model';
import { UtilsService } from 'src/utils/utils.service';
import { User } from 'src/user/entities/user.entity';
import { SuccessResponse } from 'src/common/customResponses/successResponse';
import { messagesResponse } from 'src/common/messagesResponse';

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

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - student.service.ts`);
        console.error({ error });
        throw this.utilsService.handleError(error);
      }
}
