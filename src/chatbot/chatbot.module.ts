import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { ChatBotService } from './chatbot.service';
import { ChatModel } from './model/chat.model';
import { AuthModule } from 'src/auth/auth.module';
import { ChatBotController } from './chatbot.controller';
import { HttpServiceModule } from 'src/http-service/http-service.module';
import { StudentModule } from 'src/student/student.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat]),
        UtilsModule,
        AuthModule,
        HttpServiceModule,
        StudentModule
    ],
    controllers:[ChatBotController],
    providers: [
        ChatModel,
        ChatBotService
    ],
})
export class ChatbotModule {}
