import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subject } from "../entities/subject.entity";
import { Repository } from "typeorm";
import { CreateSubjectDto } from "../dtos/createSubject.dto";
import { UpdateSubjectDto } from "../dtos/updateSubject.dto";
import { ErrorResponse } from "src/common/customResponses/errorResponse";
import { messagesResponse } from "src/common/messagesResponse";
import * as fs from 'fs-extra';
import * as fs2 from 'fs';

@Injectable()
export class SubjectModel {
    constructor(
        @InjectRepository(Subject) private readonly subjectRepository: Repository<Subject>
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
            subjects.forEach(s => delete s.urlImage);
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
            const subjectDb: Subject = await this.subjectRepository.findOneBy({id});
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
            return  [await fs.stat(subjectDb.urlImage), subjectDb.urlImage];
        } catch (error) {
            this.handleException('getImageById', error);
        }
    }

    async deleteSubjectById(id: number){
        try {
            const subjectDb: Subject = await this.getSubjectById(id);
            
            if(await fs.pathExists(subjectDb.urlImage)) await fs.remove(subjectDb.urlImage);
            await this.subjectRepository.delete(subjectDb);
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