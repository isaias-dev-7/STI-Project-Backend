import { Injectable } from "@nestjs/common";
import * as bcryptjs from 'bcryptjs';
import { Response } from "express";
import { ErrorResponse } from "src/common/customResponses/errorResponse";
import { MyResponse } from "src/common/customResponses/response";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class UtilsService {

    hashPassword(password: string) {
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(password, salt);
        return hash;
      }
    
      verifyPassword(password: string, hashPassword: string) {
        return bcryptjs.compareSync(password, hashPassword);
      }
    
      cleanDataUser(user: User) {
        delete user.password;
        return user;
      }

    handleError(error: any) {
        if (error instanceof ErrorResponse) return error;
        return new ErrorResponse(400, error.message, '');
    }

    async handleResponse(res: Response, fun: typeof MyFunctionResponse) {
        let myResponse: MyResponse;
        try {
            myResponse = await fun.call('');
        } catch (error) {
            myResponse = this.handleError(error);
        }
        return res.status(myResponse.getCode()).json(myResponse.toJSON());
    } 

}

declare function MyFunctionResponse(): Promise<MyResponse>;