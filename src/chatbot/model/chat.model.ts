import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chat } from "../entities/chat.entity";
import { ISendMessage } from "../../common/interfaces/sendMessage.interface";
import { User } from "../../user/entities/user.entity";
import { HttpService } from "../../http-service/http.service";
import { PathAIEnum } from "../../common/enums/pathAI.enum";
import * as moment from "moment";
import { ErrorResponse } from "../../common/customResponses/errorResponse";
import { messagesResponse } from "../../common/messagesResponse";
import { PaginDto } from "src/common/dto/paginDto";
import { UserModel } from "src/user/model/user.model";
import { throwError } from "rxjs";

@Injectable()
export class ChatModel {
    constructor(
        @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
        private readonly httpService: HttpService,
        private readonly userModel: UserModel
    ){}

    async sendToBot(
        body: ISendMessage,
        user: User
    ){
        try { 
        const { student } = await this.userModel.getUserbyId(user.id);
            const createAtMessageStudent = moment().valueOf();
            const response = await this.httpService.requestHttp(PathAIEnum.CHAT, body);
            if(!response) throw ErrorResponse.build({
                message: messagesResponse.chatBotUnavalible
            });
            
            const createAtMessageBot = moment().valueOf();
            const chat = this.chatRepository.create({
                student,
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

    async getMessagesByUser(user: User, {limit = 10 , page = 1}: PaginDto){
        try {
            const { student } = await this.userModel.getUserbyId(user.id);
            const [chats, total] = await this.chatRepository.findAndCount({
                skip: (page - 1) * limit,
                take: limit,
                order: { createAtMessageStudent: "DESC" },
                where: { student }
            });

            return {chats, total, page, limit, totalPages: Math.ceil(total/limit)};
        } catch (error) {
            this.handleException('getmessagwesByUser', error);
        }
    }

    async deleteChat(user: User){
        try {
            const { chats } = await this.getMessagesByUser(user, {});
            if(chats.length == 0) throw ErrorResponse.build({code: 404});
            const { student } = await this.userModel.getUserbyId(user.id);
            await this.chatRepository.delete({ student });
            return true;
        } catch (error) {
            this.handleException('deleteChat', error);
        }
    }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /chatbot/model/chat.model.ts`);
        console.error({error});
        throw error;
    }
}