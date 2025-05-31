import { ScientificDegreeEnum } from "../../common/enums/scientificDegreeEnum";
import { TeachingDegreeEnum } from "../../common/enums/teachingDegreeEnum";
import { Subject } from "../../subject/entities/subject.entity";
import { User } from "../../user/entities/user.entity";
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
        user => user.professor
    )
    user: User;

    @ManyToOne(
        () => Subject,
        subject => subject.professor,
        { nullable: true }
    )
    subject: Subject;
}
