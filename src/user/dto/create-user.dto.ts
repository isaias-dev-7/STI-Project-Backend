import { IsDefined, IsEmail, IsIn, IsInt, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { roleEnum } from "src/common/enums/roleEnum";
import { subjectEnum } from "src/common/enums/subjectEnum";

export class CreateUserDto {
    @IsDefined()
    @IsString()
    @Length(4, 10)
    username: string;

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
    @Length(4, 6)
    group?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(4)
    academicYear?: number;

    @IsOptional()
    @IsIn([subjectEnum.IA.toString()])
    subject?: string;
}
