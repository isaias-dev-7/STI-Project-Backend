import { ScientificDegreeEnum } from "src/common/enums/scientificDegreeEnum";
import { TeachingDegreeEnum } from "src/common/enums/teachingDegreeEnum";
import { Subject } from "src/subject/entities/subject.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Professor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type:'enum', enum: ScientificDegreeEnum, default: null })
    scientificDegree: string;

    @Column({ type: 'enum', enum: TeachingDegreeEnum, default: null })
    teachingDegree:string;

    @OneToOne(
        () => User, 
        user => user.professor,
        { onDelete: 'CASCADE'}
    )
    user: User;

    @ManyToOne(
        () => Subject,
        subject => subject.professor,
        { nullable: true }
    )
    subject: Subject;
}
