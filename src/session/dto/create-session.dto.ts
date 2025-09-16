import { IsDefined, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateSessionDto {
    @IsDefined()
    @IsString()
    @Length(4, 70)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDefined()
    @IsNumber()
    numberSession: number;
}
