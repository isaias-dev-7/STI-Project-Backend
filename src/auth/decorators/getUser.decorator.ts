import { createParamDecorator, ExecutionContext} from "@nestjs/common";
import { ErrorResponse } from "src/common/customResponses/errorResponse";
import { messagesResponse } from "src/common/messagesResponse";

export const GetUser = createParamDecorator(
    ( data: string, ctx: ExecutionContext ) => {
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if(!user) throw ErrorResponse.build({
            code: 500,
            message: messagesResponse.userNotFoundOnRequest
        })
        return (!data) ? user : user[data];
    }
);