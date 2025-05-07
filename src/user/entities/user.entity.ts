import { facultadEnum } from "src/common/enums/facultadEnum";
import { roleEnum } from "src/common/enums/roleEnum";
import { Professor } from "src/professor/entities/professor.entity";
import { Student } from "src/student/entities/student.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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
        professor => professor.user,
        { onDelete: 'CASCADE'}
    )
    @JoinColumn()
    professor: Professor;

    @OneToOne(
        () => Student,
        student => student.user,
        { onDelete: 'CASCADE'}
    )
    @JoinColumn()
    student: Student;
}
