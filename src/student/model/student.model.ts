import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "../entities/student.entity";
import { CreateStudentDto } from "../dto/create-student.dto";
import { User } from "src/user/entities/user.entity";

export class StudentModel {
    constructor(
        @InjectRepository(Student) private readonly studentRepository: Repository<Student>
    ){}

    async createStudent(
        {...rest}: CreateStudentDto,
        user: User
    ){
        try {
            const student = this.studentRepository.create({user, ...rest});
            await this.studentRepository.save(student);
            return true;
        } catch (error) {
            this.handleException('createStudent', error);
        }
    }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /student/model/student.model.ts`);
        console.error({error});
        throw error;
    }
}