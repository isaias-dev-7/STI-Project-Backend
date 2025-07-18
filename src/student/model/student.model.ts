import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "../entities/student.entity";
import { CreateStudentDto } from "../dto";
import { User } from "../../user/entities/user.entity";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { SuccessResponse } from "../../common/customResponses/successResponse";
import { messagesResponse } from "../../common/messagesResponse";
import { UserModel } from "../../user/model/user.model";

@Injectable()
export class StudentModel {
    constructor(
        @InjectRepository(Student) private readonly studentRepository: Repository<Student>,
        @Inject(forwardRef(() => UserModel))private readonly userModel: UserModel
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

    async getLearningStyleByUserId(id: number){
        try {
            const user = await this.userModel.getUserbyId(id);
            const studentDb = await this.getEstudentById(user.student.id);
            return studentDb.learningStyle;
        } catch (error) {
            this.handleException('getLearningStyleByUserId', error);
        }

    }

    async getEstudentById(id: number){
        try {
             const studentDb = await this.studentRepository.findOneBy({ id });
             console.log(studentDb)
             if(!studentDb) throw SuccessResponse.build({
                message: messagesResponse.userNotFound
             });

             return studentDb;
        } catch (error) {
            this.handleException('getEstudianteByUserId', error);
        }
    }

    async deleteStudentById(id: number) {
        try {
            const studentDb = await this.getEstudentById(id);
            await this.studentRepository.delete({id: studentDb.id});
            return true;
        } catch (error) {
            this.handleException('deleteStudent', error);
        }
    }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /student/model/student.model.ts`);
        console.error({error});
        throw error;
    }
}