import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chat } from "../entities/chat.entity";
import { ISendMessage } from "../../common/interfaces/sendMessage.interface";
import { User } from "../../user/entities/user.entity";
import { HttpService } from "../../http-service/http.service";
import { PathAIEnum } from "../../common/enums/pathAI.enum";
import { StudentModel } from "../../student/model/student.model";
import * as moment from "moment";
import { ErrorResponse } from "../../common/customResponses/errorResponse";
import { messagesResponse } from "../../common/messagesResponse";

@Injectable()
export class ChatModel {
    constructor(
        @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
        private readonly httpService: HttpService,
        private readonly studentModel: StudentModel
    ){}

    async sendToBot(
        body: ISendMessage,
        user: User
    ){
        try {
            const studentDb = await this.studentModel.getEstudentByUser(user);
            const createAtMessageStudent = moment().valueOf();
            const response = await this.httpService.requestHttp(PathAIEnum.CHAT, body);
            if(!response) throw ErrorResponse.build({
                message: messagesResponse.chatBotUnavalible
            });

            const createAtMessageBot = moment().valueOf();
            const chat = this.chatRepository.create({
                student: studentDb,
                messageBot: response.message,
                messageStudent: body.message,
                createAtMessageStudent,
                createAtMessageBot
            });
             
            await this.chatRepository.save(chat);
            return response;
        } catch (error) {
            this.handleException('sendToBot', error);
        }
    }

    async getMessagesByUsert(user: User){
        try {
            
        } catch (error) {
            
        }
    }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /chatbot/model/chat.model.ts`);
        console.error({error});
        throw error;
    }
}