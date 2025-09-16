import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { UtilsModule } from '../utils/utils.module';
import { ChatBotService } from './chatbot.service';
import { ChatModel } from './model/chat.model';
import { AuthModule } from '../auth/auth.module';
import { ChatBotController } from './chatbot.controller';
import { HttpServiceModule } from '../http-service/http-service.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat]),
        UtilsModule,
        AuthModule,
        HttpServiceModule,
        UserModule
    ],
    controllers:[ChatBotController],
    providers: [
        ChatModel,
        ChatBotService
    ],
})
export class ChatbotModule {}
