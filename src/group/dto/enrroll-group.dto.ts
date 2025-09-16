import { IsDefined, IsString, Length } from "class-validator";

export class EnrollGroupDto {
    @IsDefined()
    @IsString()
    @Length(4,8)
    key: string;
}