import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { PaginDto } from "src/common/dto/paginDto";
import { UtilsService } from "src/utils/utils.service";
import { ProfessorModel } from "src/professor/model/professor.model";
import { StudentModel } from "src/student/model/student.model";
import { roleEnum } from "src/common/enums/roleEnum";
import { ErrorResponse } from "src/common/customResponses/errorResponse";
import { messagesResponse } from "src/common/messagesResponse";
import * as moment from "moment";
import { UpdateUserDto } from "../dto/update-user.dto";

@Injectable()
export class UserModel {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly utilsService: UtilsService,
        private readonly professorModel: ProfessorModel,
        private readonly studentModel: StudentModel
    ){}

    async createUser({ 
        role, 
        password,
        subject, 
        academicYear,
        group, 
        fullname, 
        curseType, 
        ...rest 
    }: CreateUserDto) {
        try {
            const professor = [
                roleEnum.PROFESSOR_AUXILIAR.toString(),
                roleEnum.PROFESSOR_PRINCIPAL.toString()
            ].includes(role);
            const estudiante = role === roleEnum.ESTUDIANTE.toString();
           
            if (professor) {
                if (!subject) throw ErrorResponse.build({
                    message: messagesResponse.subjectNeeded
                });
            } else if (estudiante) {
                if (!academicYear) throw ErrorResponse.build({
                    message: messagesResponse.academicYearNeeded
                });

                if (!group) throw ErrorResponse.build({
                    message: messagesResponse.groupNeeded
                });

                if(!curseType) throw ErrorResponse.build({
                    message: messagesResponse.curseTypeNeeded
                });
            }
            const aux = fullname.toLowerCase().split(' ');

            let username = (aux.length === 3) ? 
                aux[0] + aux[1].charAt(0) + aux[2].charAt(0)
                : 
                aux[0] + aux[1].charAt(0) + aux[2].charAt(0) + aux[3].charAt(0);

            if(await this.existUserByUsername(username)) throw ErrorResponse.build({
                message: messagesResponse.userAlreadyExist
            })

            const hashedPassword = this.utilsService.hashPassword(password);
            const user = this.userRepository.create({
                role,
                createAt: moment().valueOf(),
                password: hashedPassword,
                fullname,
                username,
                active: (role === roleEnum.ADMIN),
                ...rest
            });

           const userDb = await this.userRepository.save(user);

            if (professor) {
                await this.professorModel.createProfessor({ subject }, user);
            } else if (estudiante)
                await this.studentModel.createStudent({ academicYear, group, curseType }, user);

            return userDb;
        } catch (error) {
            this.handleException('createUser', error);
        }
    }

    async getUserbyId(id: number){
        try {
            const userDb = await this.userRepository.findOneBy({id});
            if(!userDb) throw ErrorResponse.build({
                code: 404,
                message: messagesResponse.userNotFound
            });
        
            return this.utilsService.cleanDataUser(userDb);
        } catch (error) {
            this.handleException('getUserById', error);
        }
    }

    async getUserByUsername(username: string){
        try {
            const userDb = await this.userRepository.findOne({
                where: { username },
                select: {password: true, active: true, email: true}
            });
            if(!userDb) throw ErrorResponse.build({
                code: 404,
                message: messagesResponse.incorrectCredentials
            })

            return userDb;
        } catch (error) {
            this.handleException('getUserByUsername', error);
        }
    }

    async getUserByEmail(email: string){
        try {
            const userDb = await this.userRepository.findOne({
                where: { email }
            });

            if(!userDb) throw ErrorResponse.build({
                code: 404,
                message: messagesResponse.userNotFound
            })
            
            return userDb;
        } catch (error) {
            this.handleException('getUserByEmail', error);
        }
    }

    async getAllUsersWithPagination({ limit = 10, page = 1 }: PaginDto){
        try {
            let data: User[], total: number;
            [data, total] = await this.userRepository.findAndCount({
                skip: (page - 1) * limit,
                take: limit,
            });
            
            return {data, total, page, limit, totalPages: Math.ceil(total/limit)};
        } catch (error) {
            this.handleException('getAllUsersWithPagination', error);
        }
    }

    async existUserByUsername (username: string){
        try {
            const userDb = await this.userRepository.findOneBy({username});
            return userDb ? true : false;
        } catch (error) {
            this.handleException('existUserByUsername', error);
        }
    }

    async existUserByEmail (email: string){
        try {
            const userDb = await this.userRepository.findOneBy({email});
            return userDb ? true : false;
        } catch (error) {
            this.handleException('existUserByEmail', error);
        }
    }

    async deleteUserbyID(id: number){
        try {
            await this.getUserbyId(id);
            await this.userRepository.delete(id);
            return true;
        } catch (error) {
            this.handleException('deleteUserbyId', error);
        }
    }

    async updateUser(
        id: number,
        updateUserDto: UpdateUserDto
    ){
        try {
            //student 
            //professor
        } catch (error) {
            this.handleException('update user', error);
        }
    }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /user/model/user.model.ts`);
        console.error({error});
        throw error;
    }
}