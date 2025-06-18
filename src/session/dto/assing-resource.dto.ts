import { IsArray, IsDefined, IsNumber } from "class-validator";

export class AssingResourceDto {
    @IsDefined()
    @IsNumber()
    idSession: number;
    
    @IsDefined()
    @IsArray()
    @IsNumber({}, { each: true })
    idsResources: Number[];
}