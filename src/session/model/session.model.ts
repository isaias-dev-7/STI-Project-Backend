import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session } from "../entities/session.entity";
import { Repository } from "typeorm";
import { CreateSessionDto } from "../dto/create-session.dto";

@Injectable()
export class SessionModel {
    constructor(
        @InjectRepository(Session) private readonly sessionModel: Repository<Session>
    ){}

    async createSession(createSessionDto: CreateSessionDto){
        try {
            
        } catch (error) {
            this.handleException('createSession', error);
        }
    }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /group/model/user.model.ts`);
        console.error({error});
        throw error;
    }
}