import { createParamDecorator, ExecutionContext, InternalServerErrorException} from "@nestjs/common";
import { messagesResponse } from "src/common/messagesResponse";

export const GetUser = createParamDecorator(
    ( data: string, ctx: ExecutionContext ) => {
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if(!user) throw new InternalServerErrorException(messagesResponse.userNotFoundOnRequest);
        return (!data) ? user : user[data];
    }
);