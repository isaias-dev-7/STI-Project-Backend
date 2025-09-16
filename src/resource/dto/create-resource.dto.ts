import { IsDefined, IsIn, IsNumber, IsOptional, IsString } from "class-validator";
import { typeResourceEnum } from "../enums/typeResource.enum";

export class CreateResourceDto {
    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    sessionId?: number;

    @IsDefined()
    @IsIn([
        typeResourceEnum.PRAGMATIC.toString(),
        typeResourceEnum.REFLEXIVE.toString(),
        typeResourceEnum.THEORETICAL.toString()
    ])
    typeResource: string;
}
