import { Module } from '@nestjs/common';
import { HttpService } from './http.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UtilsModule } from '../utils/utils.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        HttpModule.registerAsync({
            imports:[ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                baseURL: configService.get("CHATBOT_URL"),
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            inject: [ConfigService],
        }),
        UtilsModule
    ],
    providers: [HttpService],
    exports: [HttpService]
})
export class HttpServiceModule {}
