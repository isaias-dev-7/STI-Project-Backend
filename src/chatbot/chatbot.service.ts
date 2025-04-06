import { ChatModel } from "./model/chatModel";

export class ChatService {
    constructor(
        private readonly chatModel: ChatModel
    ){}
}