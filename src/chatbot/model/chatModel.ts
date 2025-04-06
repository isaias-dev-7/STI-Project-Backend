import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chat } from "../entities/chat.entity";

@Injectable()
export class ChatModel {
    constructor(
        @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    ){}
}