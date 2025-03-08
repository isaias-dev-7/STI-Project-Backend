import { IsDefined, IsIn } from "class-validator";
import { subjectEnum } from "src/common/enums/subjectEnum";

export class CreateProfessorDto {
    @IsDefined()
    @IsIn([subjectEnum.IA.toString()])
    subject: string;
}
