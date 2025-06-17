import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { And, Like, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { PaginDto } from "../../common/dto/paginDto";
import { UtilsService } from "../../utils/utils.service";
import { ProfessorModel } from "../../professor/model/professor.model";
import { StudentModel } from "../../student/model/student.model";
import { roleEnum } from "../../common/enums/roleEnum";
import { ErrorResponse } from "../../common/customResponses/errorResponse";
import { messagesResponse } from "../../common/messagesResponse";
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
        scientificDegree,
        teachingDegree,
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
                ...rest
            });

           const userDb = await this.userRepository.save(user);

            if (professor) {
                await this.professorModel.createProfessor({ subject, scientificDegree, teachingDegree }, user);
            } else if (estudiante)
                await this.studentModel.createStudent({ academicYear, group, curseType }, user);

            return userDb;
        } catch (error) {
            this.handleException('createUser', error);
        }
    }

    async getUserbyId(id: number){
        try {
            const userDb = await this.userRepository.findOne({
                where: { id },
                relations: ["student", "professor"]
            });
            if(!userDb) throw ErrorResponse.build({
                code: 404,
                message: messagesResponse.userNotFound
            });
            return userDb;
        } catch (error) {
            this.handleException('getUserById', error);
        }
    }

    async getUserByUsername(username: string){
        try {
            const userDb = await this.userRepository.find({
                where: { username },
                relations: {
                    student: true
                },
                select: {
                    id: true,
                    role: true,
                    password: true,
                    username: true,
                    email: true,
                    active: true,
                    student: {
                        firtsTime: true
                    }
                },
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

    async getAllUsersWithPagination({ limit = 10, page = 1 , searchTerm, role }: PaginDto){
        try {
            let data: User[], total: number, where: any = [];
            if(role && searchTerm){
                where = [
                    {username: Like(`%${searchTerm}%`), role},
                    {fullname: Like(`%${searchTerm}%`), role},
                    {email: Like(`%${searchTerm}%`), role},
                ];
            }else if(role){
                where = { role };
            }else if(searchTerm){
                where = [
                    {username: Like(`%${searchTerm}%`)},
                    {fullname: Like(`%${searchTerm}%`)},
                    {email: Like(`%${searchTerm}%`)}
                ];
            }
            [data, total] = await this.userRepository.findAndCount({ 
                skip: (page - 1) * limit,
                take: limit,
                where
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
            const user = await this.getUserbyId(id);
            await this.userRepository.delete(id);

            if(user.role === roleEnum.ESTUDIANTE)
                await this.studentModel.deleteStudentById(user.student.id);
            if(user.role === roleEnum.PROFESSOR_AUXILIAR || user.role === roleEnum.PROFESSOR_PRINCIPAL)
                await this.professorModel.deleteProfessor(user.professor.id);
            return true;
        } catch (error) {
            this.handleException('deleteUserbyId', error);
        }
    }

    async updateUser(
        id: number,
        user: User,
        { currentPassword, password, email, fullname, facultad }: UpdateUserDto
    ){
        try {
            await this.getUserbyId(id);
            if(user.role == roleEnum.ADMIN.toString() && !currentPassword){
                await this.userRepository.update(id, { email, fullname, facultad });
            }else if(currentPassword){
                
                const [{password: passwordDb}] = await this.getUserByUsername(user.username);
               
                if(!await this.utilsService.verifyPassword(currentPassword, passwordDb))
                    throw ErrorResponse.build({code: 400, message: messagesResponse.currentPasswordWrong });
                let passwordHash = this.utilsService.hashPassword(password);
                await this.userRepository.update(id, { password: passwordHash });
            }
            return true;
        } catch (error) {
            this.handleException('updateUser', error);
        }
    }

    async userCountOnSystem(){
        try {
            let student = 0, professor = 0, admin = 0;
            const users = await this.userRepository.find();
            
            users.forEach( u => {
                if(u.role == roleEnum.ADMIN) admin += 1;
                else if(u.role == roleEnum.ESTUDIANTE) student += 1;
                else if(u.role == roleEnum.PROFESSOR_AUXILIAR || u.role == roleEnum.PROFESSOR_PRINCIPAL) professor += 1; 
            });

            return { 
                student, 
                professor, 
                admin, 
                total: student + professor + admin 
            };
        } catch (error) {
            this.handleException('userCountOnSystemr', error);
        }
    }

    async activateUser(id: number){
        try {
            let userDb = await this.getUserbyId(id);
            userDb.active = true;
            await this.userRepository.save(userDb);
            return true;
        } catch (error) {
            this.handleException('activateUser', error);
        }
    }

    async getGroupsByUserId(userId: number) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ["group"]
            });

            if(!user) throw ErrorResponse.build({code: 404, message: messagesResponse.userNotFound});
            return user.group;
        } catch (error) {
            this.handleException('getGroupsByUserId', error);
        }
    }

    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /user/model/user.model.ts`);
        console.error({error});
        throw error;
    }
}