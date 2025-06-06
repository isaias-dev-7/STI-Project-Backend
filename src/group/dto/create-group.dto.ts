import { IsDefined, IsNumber, IsString, Length } from "class-validator";

export class CreateGroupDto {
    @IsDefined()
    @IsString()
    @Length(4,8)
    key: string;

    @IsDefined()
    @IsString()
    @Length(4,8)
    name: string;
}
