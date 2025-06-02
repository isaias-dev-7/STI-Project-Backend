import { Injectable } from "@nestjs/common";
import { ISendMessage } from "../common/interfaces/sendMessage.interface";
import { ChatModel } from "./model/chat.model";
import { User } from "../user/entities/user.entity";
import { SuccessResponse } from "../common/customResponses/successResponse";
import { PaginDto } from "src/common/dto/paginDto";
import { UtilsService } from "src/utils/utils.service";

@Injectable()
export class ChatBotService {
    constructor(
        private readonly chatModel: ChatModel,
        private readonly utilsService: UtilsService
    ){}

    async send(
        body: ISendMessage,
        user: User
    ) {
        try {
            const response = await this.chatModel.sendToBot(body, user);
            return SuccessResponse.build({
                data: { response }
            });
        } catch (error) {
            this.handleException(error);
        }
    }

   async getMessages(user: User, paginDto: PaginDto){
        try {
            const {...rest} = await this.chatModel.getMessagesByUser(user, paginDto);
            return SuccessResponse.build({data: {...rest}});
        } catch (error) {
            this.handleException(error);
        }
   }

   private handleException(error: any){
    console.error(`[ERROR] - handleException - chat.service.ts`);
    console.error({ error });
    throw this.utilsService.handleError(error);
  }
}