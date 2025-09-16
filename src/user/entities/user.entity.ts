import { Group } from "../../group/entities/group.entity";
import { facultadEnum } from "../../common/enums/facultadEnum";
import { roleEnum } from "../../common/enums/roleEnum";
import { Professor } from "../../professor/entities/professor.entity";
import { Student } from "../../student/entities/student.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LearningPath } from "../../learning-path/entities/learning-path.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 225, nullable: false, unique: true})
    username: string;

    @Column({type: 'varchar', length: 225, nullable: false})
    fullname: string;

    @Column({type: 'varchar', length: 225, nullable: false, unique: true})
    email: string;

    @Column({type: 'varchar', length: 225, nullable: false, select: false})
    password: string;

    @Column({type: 'bigint', nullable: false})
    createAt: number;

    @Column({type: 'enum', enum: roleEnum, nullable: false})
    role: string;

    @Column({type: 'enum', enum: facultadEnum })
    facultad: string;

    @Column({ type: 'boolean', default: false})
    active: boolean;

    @OneToOne(
        () => Professor,
        professor => professor.user
    )
    @JoinColumn()
    professor: Professor;

    @OneToOne(
        () => Student,
        student => student.user
    )
    @JoinColumn()
    student: Student;

    @ManyToMany(
        () => Group,
        group => group.user
    )
    group: Group[];

    @OneToOne(
        () => LearningPath,
        learningPath => learningPath.user
    )
    learningPath: LearningPath;
}
