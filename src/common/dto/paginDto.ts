import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";
import { roleEnum } from "../enums/roleEnum";

export class PaginDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsString()
    searchTerm?: string;

    @IsOptional()
    @IsIn([
        roleEnum.ADMIN.toString(),
        roleEnum.ESTUDIANTE.toString(),
        roleEnum.PROFESSOR_AUXILIAR.toString(),
        roleEnum.PROFESSOR_PRINCIPAL.toString()
    ])
    role?: string;
}