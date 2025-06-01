import { Group } from "../../group/entities/group.entity";
import { Professor } from "../../professor/entities/professor.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Session } from "../../session/entities/session.entity";

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

    @OneToMany(
        () => Group,
        group => group.subject,
        {cascade: ["remove"], nullable: true }
    )
    group: Group[];

    @ManyToMany(
    () => Session,
    session => session.subject,
    {cascade: ["remove"], nullable: true }
   )
   session: Session[];
}
