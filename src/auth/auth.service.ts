import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserModel } from 'src/user/model/user.model';
import { UtilsService } from 'src/utils/utils.service';
import { LoginDto } from './dto/login.dto';
import { MyResponse } from 'src/common/customResponses/response';
import { ErrorResponse } from 'src/common/customResponses/errorResponse';
import { messagesResponse } from 'src/common/messagesResponse';
import { SuccessResponse } from 'src/common/customResponses/successResponse';
import { JwtService } from '@nestjs/jwt';
import { IPayload } from './interfaces/payload';

@Injectable()
export class AuthService {
    constructor(  
        @Inject(forwardRef(() => UserModel)) private readonly userModel: UserModel,
        private readonly utilsService: UtilsService,
        private readonly jwtService: JwtService
    ){}

    async login({ username, password }: LoginDto): Promise<MyResponse>{
        try {
            const userDb = await this.userModel.getUserByUsername(username);
            if(!userDb.active) 
                throw ErrorResponse.build({
                  code: 401,
                  message: messagesResponse.userInactive
            })

            if (!this.utilsService.verifyPassword(password, userDb.password)) 
                throw ErrorResponse.build({
                  code: 401,
                  message: messagesResponse.incorrectCredentials
                });
              
            const token = this.generateToken({email: userDb.email});

            return SuccessResponse.build({
                data: {
                    token,
                    username: userDb.username,
                    role: userDb.role
                }
            });
        } catch (error) {
            this.handleException('login', error);
        }
    }

    private generateToken(payload: IPayload){
        return this.jwtService.sign(payload);
    }

   private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - auth.service.ts`);
        console.error({ error });
        throw this.utilsService.handleError(error);
      }
}