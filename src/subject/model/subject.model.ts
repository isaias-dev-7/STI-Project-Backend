import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subject } from "../entities/subject.entity";
import { Repository } from "typeorm";
import { CreateSubjectDto } from "../dtos/createSubject.dto";
import { UpdateSubjectDto } from "../dtos/updateSubject.dto";
import { ErrorResponse } from "src/common/customResponses/errorResponse";
import { messagesResponse } from "src/common/messagesResponse";
import * as fs from 'fs-extra';
import { ProfessorModel } from "src/professor/model/professor.model";
import { SuccessResponse } from "src/common/customResponses/successResponse";

@Injectable()
export class SubjectModel {
    constructor(
        @InjectRepository(Subject) private readonly subjectRepository: Repository<Subject>,
        @Inject(forwardRef(() => ProfessorModel)) private readonly professorModel: ProfessorModel 
    ){}

    async createSubject(
        urlImage: string,
        { subjectName }: CreateSubjectDto
    ){
        try {
            const name = subjectName.trim().toLowerCase().replace(' ', '_');
            if(await this.subjectRepository.findOneBy({subjectName: name })) 
                throw ErrorResponse.build({
                    message: messagesResponse.subjectAlreadyExist
                });

            const subject = this.subjectRepository.create({subjectName: name, urlImage});
            await this.subjectRepository.save(subject);
            return true;
        } catch (error) {
            this.handleException('createSubject', error);
        }
    }

    async getAllSubject(){
        try {
            let subjects = await this.subjectRepository.find();
            return subjects;
        } catch (error) {
            this.handleException('getAllSubject', error);
        }
    }

    async updateSubjectById(
        id: number,
        urlImage: string,
        { subjectName }: UpdateSubjectDto
    ){
        try {
            if (urlImage) {
                const subjectDb: Subject = await this.getSubjectById(id);
                if (await fs.pathExists(subjectDb.urlImage)) await fs.remove(subjectDb.urlImage);
            }

            await this.subjectRepository.update(id, { urlImage, subjectName });
            return true;
        } catch (error) {
            this.handleException('updateSubjectById', error);
        }
    }

    async getSubjectById(id: number){
        try {
            const subjectDb: Subject = await this.subjectRepository.findOne({
                where: { id },
                select: {
                    id: true,
                    urlImage: true,
                }
            });
            if(!subjectDb) throw ErrorResponse.build({
                message: messagesResponse.subjectNotFound
            });

            return subjectDb;
        } catch (error) {
            this.handleException('getSubjectByID', error);
        }
    }

    async getImageById(id: number){
        try {
            const subjectDb: Subject = await this.getSubjectById(id);
            if(!subjectDb.urlImage) SuccessResponse.build({
                message: messagesResponse.imageNotFound
            })
            return  [await fs.stat(subjectDb.urlImage), subjectDb.urlImage];
        } catch (error) {
            this.handleException('getImageById', error);
        }
    }

    async deleteSubjectById(id: number){
        try {
            const subjectDb: Subject = await this.getSubjectById(id);

            if(await fs.pathExists(subjectDb.urlImage)) await fs.remove(subjectDb.urlImage);
            await this.professorModel.deleteRelationSubject(subjectDb);
            await this.subjectRepository.delete({ id: subjectDb.id});
            return true;
        } catch (error) {
            this.handleException('deleteSubjectById', error);
        }
    }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /subject/model/subject.model.ts`);
        console.error({error});
        throw error;
    }
}