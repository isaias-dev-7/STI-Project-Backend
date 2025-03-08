import { roleEnum } from "src/common/enums/roleEnum";
import { Professor } from "src/professor/entities/professor.entity";
import { Student } from "src/student/entities/student.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 10, nullable: false, unique: true})
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

    @Column({ type: 'boolean', default: false, select: false})
    active: boolean;

    @OneToMany(
        () => Professor,
        professor => professor.user
    )
    professor: Professor[];

    @OneToMany(
        () => Student,
        student => student.user
    )
    student: Student[];
}
