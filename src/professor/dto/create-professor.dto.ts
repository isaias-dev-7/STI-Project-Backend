import { IsDefined, IsIn, IsOptional } from "class-validator";
import { ScientificDegreeEnum } from "src/common/enums/scientificDegreeEnum";
import { TeachingDegreeEnum } from "src/common/enums/teachingDegreeEnum";

export class CreateProfessorDto {
    @IsDefined()
    subject: number;

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
