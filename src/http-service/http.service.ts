import { Injectable } from "@nestjs/common";
import { HttpService as HTTP } from "@nestjs/axios"
import { PathAIEnum } from "../common/enums/pathAI.enum";
import { firstValueFrom } from "rxjs";
import { ISendMessage } from "../common/interfaces/sendMessage.interface";
import { UtilsService } from "../utils/utils.service";
import { ErrorResponse } from "src/common/customResponses/errorResponse";
import { messagesResponse } from "src/common/messagesResponse";

@Injectable()
export class HttpService {
    constructor(
        private readonly http: HTTP,
        private readonly utilsService: UtilsService
    ){}

    async requestHttp(url: PathAIEnum, body: ISendMessage) {
        try {
            const response = await firstValueFrom(
                this.http.post<{ message: string }>(url, body)
            );
            const { data } = response;

            return data;
        } catch (error) {
            if (error.code == "ECONNABORTED")
                throw ErrorResponse.build({
                    message: messagesResponse.chatBotUnavalible
                });

            this.handleException(error);
        }
    }

    handleException(error: any){
        console.error(`[ERROR] - handleException - HttpService.service.ts`);
        console.error({ error });
        throw this.utilsService.handleError(error);
      }
}