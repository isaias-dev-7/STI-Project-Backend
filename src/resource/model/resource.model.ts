import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Resource } from "../entities/resource.entity";
import { Repository } from "typeorm";
import { CreateResourceDto } from "../dto/create-resource.dto";
import { UtilsService } from "../../utils/utils.service";
import { SessionModel } from "../../session/model/session.model";
import { User } from "src/user/entities/user.entity";
import { UserModel } from "src/user/model/user.model";
import { SubjectModel } from "src/subject/model/subject.model";

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

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /resource/model/resource.model.ts`);
        console.error({error});
        throw error;
    }
}