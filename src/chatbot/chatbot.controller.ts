import { Body, Controller, Post, Res } from "@nestjs/common";
import { ChatBotService } from "./chatbot.service";
import { UtilsService } from "../utils/utils.service";
import { GetUser } from "../auth/decorators/getUser.decorator";
import { Response } from "express";
import { User } from "../user/entities/user.entity";
import { ISendMessage } from "src/common/interfaces/sendMessage.interface";
import { Auth } from "../auth/decorators/auth.decorator";
import { roleEnum } from "../common/enums/roleEnum";

@Controller('chatbot')
export class ChatBotController {
    constructor(
        private readonly chatBotService: ChatBotService,
        private readonly utilsService: UtilsService
    ){}

    @Post()
    @Auth(roleEnum.ESTUDIANTE)
    sendText(
        @Body() body: ISendMessage,
        @GetUser() user: User,
        @Res() res: Response
    ){
        this.utilsService.handleResponse(res, async () => 
            this.chatBotService.send(body, user)
        );
    }
}