import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subject } from "../entities/subject.entity";
import { Repository } from "typeorm";
import { CreateSubjectDto } from "../dtos/createSubject.dto";
import { UpdateSubjectDto } from "../dtos/updateSubject.dto";
import { ErrorResponse } from "../../common/customResponses/errorResponse";
import { messagesResponse } from "../../common/messagesResponse";
import * as fs from 'fs-extra';
import { ProfessorModel } from "../../professor/model/professor.model";
import { Professor } from "../../professor/entities/professor.entity";

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
            if(!subjectDb.urlImage) throw ErrorResponse.build({
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

    async getSubjectByProfessor(professor: Professor){
        try {
            const subject = await this.subjectRepository.findOneBy({ professor });
            if(!subject) throw ErrorResponse.build({ 
                code: 404,
                message: messagesResponse.subjectNotFound 
            });
            return subject;
        } catch (error) {
            this.handleException('getSubjectByUser', error);
        }
    }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /subject/model/subject.model.ts`);
        console.error({error});
        throw error;
    }
}