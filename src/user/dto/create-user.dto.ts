import { Type } from "class-transformer";
import { IsDefined, IsEmail, IsIn, IsInt, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { curseEnum } from "src/common/enums/curseEnum";
import { facultadEnum } from "src/common/enums/facultadEnum";
import { roleEnum } from "src/common/enums/roleEnum";
import { ScientificDegreeEnum } from "src/common/enums/scientificDegreeEnum";
import { TeachingDegreeEnum } from "src/common/enums/teachingDegreeEnum";

export class CreateUserDto {
    @IsDefined()
    @IsString()
    fullname: string;

    @IsDefined()
    @IsEmail()
    email: string;

    @IsDefined()
    @IsString()
    @Length(8, 15)
    password: string;

    @IsDefined()
    @IsString()
    @IsIn([
        roleEnum.ADMIN.toString(), 
        roleEnum.ESTUDIANTE.toString(), 
        roleEnum.PROFESSOR_AUXILIAR.toString(), 
        roleEnum.PROFESSOR_PRINCIPAL.toString()
    ])
    role: string;

    @IsOptional()
    @IsString()
    @IsIn([
       facultadEnum.FACULTAD1.toString(),
       facultadEnum.FACULTAD2.toString(),
       facultadEnum.FACULTAD3.toString(),
       facultadEnum.FACULTAD4.toString(),
       facultadEnum.FACULTAD5.toString(),
       facultadEnum.FACULTAD6.toString()
    ])
    facultad?: string;

    @IsOptional()
    @IsString()
    @Length(4, 6)
    group?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(4)
    academicYear?: number;

    @IsOptional()
    @IsString()
    @IsIn([
       curseEnum.DIURNO.toString(),
       curseEnum.POR_ENCUENTRO.toString()
    ])
    curseType?: string;

    @IsOptional()
    @Type(() => Number)
    subject?: number;

    @IsOptional()
    @IsIn([
        ScientificDegreeEnum.DrC.toString(), 
        ScientificDegreeEnum.MsC.toString()
    ])
    scientificDegree?: string;

    @IsOptional()
    @IsIn([
        TeachingDegreeEnum.ENGINEER.toString()
    ])
    teachingDegree?: string;
}
