import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { UserModel } from 'src/user/model/user.model';
import { UtilsService } from 'src/utils/utils.service';
import { LoginDto } from './dto/login.dto';
import { MyResponse } from 'src/common/customResponses/response';
import { ErrorResponse } from 'src/common/customResponses/errorResponse';
import { messagesResponse } from 'src/common/messagesResponse';
import { SuccessResponse } from 'src/common/customResponses/successResponse';
import { JwtService } from '@nestjs/jwt';
import { IPayload } from './interfaces/payload';
import { roleEnum } from 'src/common/enums/roleEnum';
import { User } from 'src/user/entities/user.entity';
import { HttpService } from 'src/http-service/http.service';
import { SeedService } from 'src/seed/seed.service';

@Injectable()
export class AuthService {
    constructor(  
        @Inject(forwardRef(() => UserModel)) private readonly userModel: UserModel,
        private readonly utilsService: UtilsService,
        private readonly jwtService: JwtService,
        private readonly seedService: SeedService
    ){}

    async login({ username, password }: LoginDto): Promise<MyResponse> {
        try {
            let firtsTime;
            const [{
                password: passwordDb,
                username: usernameDb,
                active,
                role,
                email,
                student
            }] = await this.userModel.getUserByUsername(username);
            if(student) firtsTime  = student.firtsTime;

            if (!active)
                throw ErrorResponse.build({
                    code: 401,
                    message: messagesResponse.userInactive
                })

            if (!this.utilsService.verifyPassword(password, passwordDb))
                throw ErrorResponse.build({
                    code: 401,
                    message: messagesResponse.incorrectCredentials
                });

            const token = this.generateToken({ email });

            return SuccessResponse.build({
                data: {
                    username: usernameDb,
                    token,
                    role,
                    firtsTime
                }
            });
        } catch (error) {
            this.handleException('login', error);
        }
    }

    async onModuleInit() {
        try {
          await this.seedService.insertData();
          const existsUser = await this.userModel.existUserByEmail(
            process.env.EMAIL_ADMIN,
          );
    
          if (!existsUser) {
            const savedUser: User = await this.userModel.createUser(
              {
                email: process.env.EMAIL_ADMIN,
                fullname: process.env.NAME_ADMIN,
                role: roleEnum.ADMIN,
                password: process.env.PASS_ADMIN,
              }
            );
            await this.userModel.activateUser(savedUser.email);
            console.log(
              `El usuario ${process.env.EMAIL_ADMIN} ha sido creado con éxito`,
            );
          } else {
            console.log(`El usuario ${process.env.EMAIL_ADMIN} ya existe`);
          }
        } catch (error) {
          console.log(`[ERROR] - onModuleInit - auth.service.ts`);
          console.error({ error });
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