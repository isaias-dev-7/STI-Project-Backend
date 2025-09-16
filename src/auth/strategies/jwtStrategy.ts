import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt,  Strategy } from "passport-jwt";
import { UserModel } from "../../user/model/user.model";
import { IPayload } from "../interfaces/payload";
import { User } from "../../user/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy )  {
    constructor(
        private readonly userModel: UserModel,
        configService: ConfigService
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate( payload: IPayload ) : Promise <User> {
        const { email } = payload;
        const user = await this.userModel.getUserByEmail(email);
        return user;
    }
}