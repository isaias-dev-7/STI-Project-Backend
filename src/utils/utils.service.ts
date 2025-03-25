import { Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import * as bcryptjs from 'bcryptjs';
import { Response } from "express";
import { ErrorResponse } from "src/common/customResponses/errorResponse";
import { MyResponse } from "src/common/customResponses/response";
import { User } from "src/user/entities/user.entity";
import { IPayload } from "src/auth/interfaces/payload";

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
    
      generateToken(key: IPayload, expire: boolean) {
        let token: string;
    
        if (expire) {
          token = jwt.sign({ key }, process.env.JWT_SECRET, {
            expiresIn: '30m',
          });
        } else {
          token = jwt.sign({ key }, process.env.JWT_SECRET);
        }
    
        return token;
      }
    
      verifyToken(token: string) {
        try {
          const payload = jwt.verify(token, process.env.JWT_SECRET);
          return payload['key'];
        } catch (error) {
          console.log(`[ERROR] - verifyToken - utils.service.ts`);
          console.log({ error });
          throw error;
        }
      }

      cleanDataUser(user: User) {
        delete user.password;
        delete user.active;
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