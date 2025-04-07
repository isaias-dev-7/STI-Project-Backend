import { Injectable } from "@nestjs/common";
import { ISendMessage } from "src/common/interfaces/sendMessage.interface";
import { ChatModel } from "./model/chat.model";
import { User } from "src/user/entities/user.entity";
import { SuccessResponse } from "src/common/customResponses/successResponse";
import { StudentModel } from "src/student/model/student.model";

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