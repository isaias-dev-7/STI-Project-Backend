import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "../entities/student.entity";
import { CreateStudentDto } from "../dto";
import { User } from "src/user/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { SuccessResponse } from "src/common/customResponses/successResponse";
import { messagesResponse } from "src/common/messagesResponse";

@Injectable()
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

    async setLearningStyle(
        user: User,
        learningStyle: string
    ) {
        try {
            let studentDb = await this.studentRepository.findOne({
                where: { user }
            });
            studentDb.learningStyle = learningStyle;
            studentDb.firtsTime = false;
            await this.studentRepository.save(studentDb);
            return true;
        } catch (error) {
            this.handleException('setLearnigStyle', error);
        }
    }

    async getEstudentByUserId(id: number){
        try {
             const studentDb = await this.studentRepository.findOneBy({id});
             if(!studentDb) throw SuccessResponse.build({
                message: messagesResponse.userNotFound
             });

             return studentDb;
        } catch (error) {
            this.handleException('getEstudianteByUserId', error);
        }
    }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /student/model/student.model.ts`);
        console.error({error});
        throw error;
    }
}