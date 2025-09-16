import { IsDefined, IsIn, IsInt, IsString, Length, Max, Min} from "class-validator";
import { curseEnum } from "src/common/enums/curseEnum";

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

    @IsDefined()
    @IsIn([
        curseEnum.DIURNO.toString(),
        curseEnum.POR_ENCUENTRO.toString()
    ])
    curseType: string;
}
