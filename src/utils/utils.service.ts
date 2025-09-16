import { Injectable } from "@nestjs/common";
import * as bcryptjs from 'bcryptjs';
import { Response } from "express";
import { createWriteStream } from "fs";
import { join } from "path";
import { ErrorResponse } from "../common/customResponses/errorResponse";
import { MyResponse } from "../common/customResponses/response";
import { ISavedFile } from "../common/interfaces/saveFile.interface";
import { messagesResponse } from "../common/messagesResponse";
import { User } from "../user/entities/user.entity";
import { uploadsPathEnum } from "src/common/enums/uploadsPath,enum";

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
            `../../uploads${uploadsPathEnum.SUBJECT_IMAGE}${fileName}.${formatFile}`,
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

      saveFile(file: Express.Multer.File){
        try {
          const response: ISavedFile = { fileName: null, filePath: null };
          const fileName = new Date().getTime().toString();
          const array = file.originalname.replace(" ", "_").split('.');
          const formatFile: string = array[array.length - 1].toLowerCase();

          if (!['jpg', 'png', 'jpeg', 'mp4', 'mp3', 'pdf'].includes(formatFile)) 
            throw ErrorResponse.build({
              message: messagesResponse.invalidFormatFile,

            });

          const operations: Record<string, () => string> = {
            "mp4": () => this.saveFileAux(file, uploadsPathEnum.VIDEO, fileName, formatFile),
            "mp3": () => this.saveFileAux(file, uploadsPathEnum.AUD, fileName, formatFile),
            "pdf": () => this.saveFileAux(file, uploadsPathEnum.DOC, fileName, formatFile),
            "jpg": () => this.saveFileAux(file, uploadsPathEnum.IMAGE, fileName, formatFile),
            "png": () => this.saveFileAux(file, uploadsPathEnum.IMAGE, fileName, formatFile),
            "jpeg": () => this.saveFileAux(file, uploadsPathEnum.IMAGE, fileName, formatFile)
          };

          response.filePath = operations[formatFile]();
          return response;
        } catch (error) {
          throw this.handleError(error);
        }
      }

      private saveFileAux(file: Express.Multer.File, path: uploadsPathEnum, fileName: string, formatFile: string){
        try {
          const filePath = join(
            __dirname,
            `../../uploads${path}${fileName}.${formatFile}`,
          );
          
          const fileStream = createWriteStream(filePath);
          fileStream.write(file.buffer);
          fileStream.end();

          return filePath;
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