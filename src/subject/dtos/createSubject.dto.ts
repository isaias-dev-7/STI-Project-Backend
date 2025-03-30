import { IsDefined, IsString } from "class-validator";

export class CreateSubjectDto {
    @IsDefined()
    @IsString()
    subjectName: string;
}