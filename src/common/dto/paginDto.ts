import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

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
}