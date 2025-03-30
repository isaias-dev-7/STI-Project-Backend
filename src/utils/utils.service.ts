import { Injectable } from "@nestjs/common";
import * as bcryptjs from 'bcryptjs';
import { Response } from "express";
import { createWriteStream } from "fs";
import { join } from "path";
import { ErrorResponse } from "src/common/customResponses/errorResponse";
import { MyResponse } from "src/common/customResponses/response";
import { ISavedFile } from "src/common/interfaces/saveFile.interface";
import { messagesResponse } from "src/common/messagesResponse";
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

      saveImage(image: Express.Multer.File){
        try {
          const response: ISavedFile = { fileName: null, filePath: null };
          const fileName = new Date().getTime().toString();
          const formatFile: string = image.originalname.split('.')[1].toLowerCase();
    
          if (!['jpg', 'png', 'jpeg'].includes(formatFile)) {
            throw ErrorResponse.build({
              message: messagesResponse.invalidFormatImage,

            });
          }
    
          const filePath = join(
            __dirname,
            `../../uploads/subjectImages/${fileName}.${formatFile}`,
          );
          const fileStream = createWriteStream(filePath);
          fileStream.write(image.buffer);
          fileStream.end();
          response.filePath = filePath;
    
          return response;
        } catch (error) {
          throw this.handleError(error);
        }
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