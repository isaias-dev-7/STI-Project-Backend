import { Injectable } from "@nestjs/common";
import { ISendMessage } from "../common/interfaces/sendMessage.interface";
import { ChatModel } from "./model/chat.model";
import { User } from "../user/entities/user.entity";
import { SuccessResponse } from "../common/customResponses/successResponse";

@Injectable()
export class ChatBotService {
    constructor(
        private readonly chatModel: ChatModel,
    ){}

    async send(
        body: ISendMessage,
        user: User
    ){
        const response = await this.chatModel.sendToBot(body, user);
        return SuccessResponse.build({
            data:{ response }
        });
    }
}