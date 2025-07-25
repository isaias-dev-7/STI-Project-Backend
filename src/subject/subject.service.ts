import { Injectable } from '@nestjs/common';
import { SubjectModel } from './model/subject.model';
import { UtilsService } from '../utils/utils.service';
import { CreateSubjectDto } from './dtos/createSubject.dto';
import { SuccessResponse } from '../common/customResponses/successResponse';
import { messagesResponse } from '../common/messagesResponse';
import { Subject } from './entities/subject.entity';
import { UpdateSubjectDto } from './dtos/updateSubject.dto';
import { Response } from 'express';
import * as fs from 'fs';

@Injectable()
export class SubjectService {
    constructor(
        private readonly subjectModel: SubjectModel,
        private readonly utilsService: UtilsService
    ){}

    async create(
        image: Express.Multer.File,
        createSubjectDto: CreateSubjectDto
    ){
        try {
            let urlImage: string = null;
            if(image) urlImage = this.utilsService.saveImage(image).filePath;

            await this.subjectModel.createSubject(urlImage, createSubjectDto);
            return SuccessResponse.build({
                message: messagesResponse.subjectCreated
            });
        } catch (error) {
            this.handleException(error);
        }
    }

    async getAll(){
        try {
            const subjects: Subject[] = await this.subjectModel.getAllSubject();
            return SuccessResponse.build({
                data: subjects
            });
        } catch (error) {
            this.handleException(error);
        }
    }

    async updateSubject(
        id: number,
        image: Express.Multer.File,
        updateSubjectDto: UpdateSubjectDto
    ){
        try {
            let urlImage: string = null;
            if(image) urlImage = this.utilsService.saveImage(image).filePath;
            await this.subjectModel.updateSubjectById(id, urlImage, updateSubjectDto);

            return SuccessResponse.build({
                message: messagesResponse.subjectUpdated
            });
        } catch (error) {
            this.handleException(error);
        }
    }

    async getImage(
        id: number,
        res: Response
    ) {
        try {
            const [fileStat, path] = await this.subjectModel.getImageById(id);
            res.setHeader('Content-Length', fileStat.size);
            res.setHeader('Cache-Control', 'public, max-age=31557600');
            return fs.createReadStream(path).pipe(res);   
        } catch (error) {
            return res.status(error.code).json(error);
        }
    }

    async deleteSubject(id: number){
        try {
            await this.subjectModel.deleteSubjectById(id);
            return SuccessResponse.build({
                message: messagesResponse.subjectDeleted
            });
        } catch (error) {
            this.handleException(error);
        }
    }

    handleException(error: any){
        console.error(`[ERROR] - handleException - subject.service.ts`);
        console.error({ error });
        throw this.utilsService.handleError(error);
      }
}
