import { IsDefined, IsInt, IsString, Length, Max, Min} from "class-validator";

export class CreateStudentDto {
    @IsDefined()
    @IsString()
    @Length(4,6)
    group: string;

    @IsDefined() 
    @IsInt()
    @Min(1)
    @Max(4)
    academicYear: number;

    //TODO relations with user
}
