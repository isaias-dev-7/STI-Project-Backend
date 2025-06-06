import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session } from "../entities/session.entity";
import { Repository } from "typeorm";
import { CreateSessionDto } from "../dto/create-session.dto";
import { SubjectModel } from "../../subject/model/subject.model";
import { ErrorResponse } from "../../common/customResponses/errorResponse";
import { messagesResponse } from "../../common/messagesResponse";
import { User } from "../../user/entities/user.entity";
import { UpdateSessionDto } from "../dto/update-session.dto";
import { UserModel } from "../../user/model/user.model";

@Injectable()
export class SessionModel {
    constructor(
        @InjectRepository(Session) private readonly sessionRepository: Repository<Session>,
        private readonly subjectModel: SubjectModel,
        private readonly userModel: UserModel
    ){}

    async createSession({name, numberSession, description}: CreateSessionDto, user: User){
        try {
             if(await this.sessionRepository.findOneBy({numberSession})) throw ErrorResponse.build({
                code: 400,
                message: messagesResponse.sessionAlreadyExist
            });
            const { professor }= await this.userModel.getUserbyId(user.id);
            const subject = await this.subjectModel.getSubjectByProfessor(professor);
            const session = this.sessionRepository.create({ name, numberSession, description, subject});
            await this.sessionRepository.save(session);
            return true;
        } catch (error) {
            this.handleException('createSession', error);
        }
    }

    async getAllSession(user: User){
        try {
            const { professor }= await this.userModel.getUserbyId(user.id);
            const subject = await this.subjectModel.getSubjectByProfessor(professor);
            const sessions = await this.sessionRepository.find({
                where: { subject }
            });
            return sessions;
        } catch (error) {
            this.handleException('getAllSession', error);
        }
    }

    async updateSessionById(id: number, {description, name, numberSession}: UpdateSessionDto){
        try {
            if(await this.sessionRepository.findOneBy({numberSession})) throw ErrorResponse.build({
                code: 400,
                message: messagesResponse.sessionAlreadyExist
            });
            await this.sessionRepository.update(id, {description, name, numberSession});
            return true;
        } catch (error) {
            this.handleException('updateSessionById', error);
        }
    }

    async getSessionById(id: number){
        try {
            const session = await this.sessionRepository.findOneBy({id});
            if(!session) throw ErrorResponse.build({
                code: 400, 
                message: messagesResponse.sessionNotFound
            })
            return session;
        } catch (error) {
            this.handleException('getSessionById', error);
        }
    }

    async deleteSessioById(id: number){
        try {
            await this.getSessionById(id);
            await this.sessionRepository.delete(id);
            return true;
        } catch (error) {
            this.handleException('deleteSessioById', error);
        }
    }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /group/model/user.model.ts`);
        console.error({error});
        throw error;
    }
}