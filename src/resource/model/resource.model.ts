import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Resource } from "../entities/resource.entity";
import { Repository } from "typeorm";
import { CreateResourceDto } from "../dto/create-resource.dto";
import { UtilsService } from "../../utils/utils.service";
import { SessionModel } from "../../session/model/session.model";
import { User } from "../../user/entities/user.entity";
import { UserModel } from "../../user/model/user.model";
import { SubjectModel } from "../../subject/model/subject.model";
import { messagesResponse } from "../../common/messagesResponse";
import { ErrorResponse } from "../../common/customResponses/errorResponse";
import { UpdateResourceDto } from "../dto/update-resource.dto";
import { PaginDto } from "../../common/dto/paginDto";
import * as fs from 'fs-extra';
import { Subject } from "src/subject/entities/subject.entity";

@Injectable()
export class ResourceModel {
    constructor(
        @InjectRepository(Resource) private readonly resourceRepository: Repository<Resource>,
        private readonly utilsService: UtilsService,
        private readonly sessionModel: SessionModel,
        private readonly userModel: UserModel,
        private readonly subjectModel: SubjectModel
    ){}

    async createResource(
        file: Express.Multer.File, 
        { description, sessionId, typeResource }: CreateResourceDto,
        user: User
    ){
        try {
            const { filePath } = this.utilsService.saveFile(file);
            const { professor } = await this.userModel.getUserbyId(user.id);
            const subject = await this.subjectModel.getSubjectByProfessor(professor);
            let session = null; 
            if(sessionId) session = await this.sessionModel.getSessionById(sessionId);
            
            const resource = this.resourceRepository.create({ description, session, url: filePath, type: typeResource, subject });
            await this.resourceRepository.save(resource);
            return true;
        } catch (error) {
            this.handleException("createResource", error);
        }
    }

    async getResourceById(id: number){
        try {
            const resourceDb = await this.resourceRepository.findOneBy({id});
            if(!resourceDb) throw ErrorResponse.build({code: 404, message: messagesResponse.resourceNotFound });
            return resourceDb;
        } catch (error) {
            this.handleException('getResourceById', error);
        }
    }

    async updateResourceById(id: number, {description, typeResource}: UpdateResourceDto) {
        try {
            await this.getResourceById(id);
            await this.resourceRepository.update(id, { description, type: typeResource});
            return true;
        } catch (error) {
            this.handleException('updateResourceById', error);
        }
    }

    async getAllResources(user: User, {limit = 10 , page = 1}: PaginDto){
        try {
            const { professor } = await this.userModel.getUserbyId(user.id);
            const subject = await this.subjectModel.getSubjectByProfessor(professor);
            const [resources, total] = await this.resourceRepository.findAndCount({
                skip: (page - 1) * limit,
                take: limit,
                where: { subject },
                select: { id: true, description: true, type: true }
            });

            return {resources, total, page, limit, totalPages: Math.ceil(total/limit)};
        } catch (error) {
            this.handleException('getAllResources', error);
        }
    }

    async deleteResourceById(id: number){
        try {
           const resourceDb = await this.getResourceById(id);
           if(await fs.pathExists(resourceDb.url)) await fs.remove(resourceDb.url);
           await this.resourceRepository.delete(id);
           return true;
        } catch (error) {
            this.handleException('deleteResourceById',error);
        }
    }

   async getContentResourceById(id: number){
        try {
            const resourceDb = await this.getResourceById(id);
            return  [await fs.stat(resourceDb.url), resourceDb.url];
        } catch (error) {
            this.handleException('getContentResourceById', error);
        }
    }

    async getAllResourcesBySubject(subject: Subject){
        try {
            const data: Record<number, Resource[]> = {};
            const resources = await this.resourceRepository.find({
                where: { subject },
                relations: ['session']
            });
            
            resources.forEach(r => {
                let session = r.session;
                delete r.session;
                data[session.id] ? data[session.id].push(r) : (data[session.id] = [r]);
            });

            return data;
        } catch (error) {
            this.handleException('getAllResourcesBySubject', error);
        }
    }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /resource/model/resource.model.ts`);
        console.error({error});
        throw error;
    }
}