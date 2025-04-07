import { Professor } from "src/professor/entities/professor.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Subject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 225, nullable: false })
    subjectName: string;

    @Column({ type: 'varchar', length: 225, default: null, select: false })
    urlImage?: string;

    @OneToMany(
        () => Professor,
        professor => professor.subject
    )
    professor: Professor[];
}