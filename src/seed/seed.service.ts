import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Professor } from "../professor/entities/professor.entity";
import { Student } from "../student/entities/student.entity";
import { Subject } from "../subject/entities/subject.entity";
import { User } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { initialData } from "./data/data";
import * as moment from "moment";
import * as bcryptjs from 'bcryptjs';
import { Group } from "src/group/entities/group.entity";

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Student) private readonly studentRepository: Repository<Student>,
        @InjectRepository(Professor) private readonly professorRepository: Repository<Professor>,
        @InjectRepository(Subject) private readonly subjectRepository: Repository<Subject>,
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>
    ) { }

    async deleteAll() {
        try {
            await this.groupRepository.createQueryBuilder()
                .delete()
                .from('group_user_user')
                .execute();

            await this.groupRepository.createQueryBuilder()
                .delete()
                .where({})
                .execute();
                
            await this.userRepository.createQueryBuilder()
                .delete()
                .where({})
                .execute();

            await this.studentRepository.createQueryBuilder()
                .delete()
                .where({})
                .execute();

            await this.professorRepository.createQueryBuilder()
                .delete()
                .where({})
                .execute();

            await this.subjectRepository.createQueryBuilder()
                .delete()
                .where({})
                .execute();

            return true;
        } catch (error) {
            console.log(error);
        }
    }

    async insertData() {
        try {
            await this.deleteAll();
            const { professors, students, subjects, users } = initialData;
            let createAt = moment().valueOf();
            let subjectsDb: Subject[] = [];
            let usersDb: User[] = [];
            let usersDbE: User[] = [];
            let usersDbP: User[] = [];
            let studentDb: Student[] = [];
            let professorDb: Professor[] = [];
            
            subjects.forEach( s => {
                subjectsDb.push(this.subjectRepository.create(s));
            });
            await this.subjectRepository.save(subjectsDb);

            users.forEach( u => {
                u.password = bcryptjs.hashSync(u.password,10);
                usersDb.push(this.userRepository.create({...u, createAt, active: true}));
                createAt++;
            });
            await this.userRepository.save(usersDb);

            students.forEach( u => {
                u.password = bcryptjs.hashSync(u.password,10);
                usersDbE.push(this.userRepository.create({createAt,active: true, ...u}));
                createAt++;
            });
            await this.userRepository.save(usersDbE);

            professors.forEach( p => {
                p.password = bcryptjs.hashSync(p.password,10);
                usersDbP.push(this.userRepository.create({createAt, active: true, ...p}));
                createAt++;
            });
            await this.userRepository.save(usersDbP);

            usersDbE.forEach((v, i) => {
                studentDb.push(this.studentRepository.create({user: v, ...students[i]}));
            });
            await this.studentRepository.save(studentDb);

            usersDbP.forEach((v, i) => {
                professorDb.push(this.professorRepository.create({user: v, subject: subjectsDb[0], ...professors[i]}));
            });
            await this.professorRepository.save(professorDb);

            console.log({ message: "SEED EXECUTED" });
        } catch (error) {
            console.log(error);
        }
    }

}