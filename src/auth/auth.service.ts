import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/user/model/user.model';
import { UtilsService } from 'src/utils/utils.service';
import { LoginDto } from './dto/login.dto';
import { MyResponse } from 'src/common/customResponses/response';
import { ErrorResponse } from 'src/common/customResponses/errorResponse';
import { messagesResponse } from 'src/common/messagesResponse';
import { SuccessResponse } from 'src/common/customResponses/successResponse';

@Injectable()
export class AuthService {
    constructor(
        private readonly userModel: UserModel,
        private readonly utilsService: UtilsService
    ){}

    async login({ username, password }: LoginDto): Promise<MyResponse>{
        try {
            const userDb = await this.userModel.getUserByUsername(username);
            if (!this.utilsService.verifyPassword(password, userDb.password)) 
                throw ErrorResponse.build({
                  code: 401,
                  message: messagesResponse.incorrectCredentials
                });
              
            const token = this.utilsService.generateToken({ email: userDb.email }, true);

            return SuccessResponse.build({ data: { token } })
        } catch (error) {
            this.handleException('login', error);
        }
    }

   private handleException(description: string, error: any, res?: Response) {
        console.error(`[ERROR] - ${description} - auth.service.ts`);
        console.error({ error });
        throw this.utilsService.handleError(error);
      }
}