import { Body, Controller, Delete, Get, Post, Query, Res } from "@nestjs/common";
import { ChatBotService } from "./chatbot.service";
import { UtilsService } from "../utils/utils.service";
import { GetUser } from "../auth/decorators/getUser.decorator";
import { Response } from "express";
import { User } from "../user/entities/user.entity";
import { ISendMessage } from "src/common/interfaces/sendMessage.interface";
import { Auth } from "../auth/decorators/auth.decorator";
import { roleEnum } from "../common/enums/roleEnum";
import { PaginDto } from "src/common/dto/paginDto";

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

    @Get()
    @Auth(roleEnum.ESTUDIANTE)
    getChat(
        @Query() paginDto: PaginDto,
        @GetUser() user: User,
        @Res() res: Response
    ){
        this.utilsService.handleResponse(res, async () => 
            this.chatBotService.getMessages(user, paginDto)
        );
    }

    @Delete()
    @Auth(roleEnum.ESTUDIANTE)
    delete(
        @GetUser() user: User,
        @Res() res: Response
    ){
        this.utilsService.handleResponse(res, async () => 
            this.chatBotService.remove(user)
        );
    }
}