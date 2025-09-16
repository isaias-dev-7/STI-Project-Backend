import { IsDefined, IsString } from "class-validator";

export class LearningStyleDto {
    @IsDefined()
    @IsString()
    learningStyle: string;
}