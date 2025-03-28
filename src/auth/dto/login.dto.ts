import { IsDefined, IsString, Length } from "class-validator";

export class LoginDto {
    @IsDefined()
    @IsString()
    username: string;

    @IsDefined()
    @IsString()
    @Length(6)
    password: string;
}