import { Group } from "../../group/entities/group.entity";
import { Professor } from "../../professor/entities/professor.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Session } from "../../session/entities/session.entity";
import { Resource } from "src/resource/entities/resource.entity";
import { LearningPath } from "src/learning-path/entities/learning-path.entity";

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
        {cascade: ["remove"]}
    )
    group: Group[];

    @OneToMany(
        () => Session,
        session => session.subject,
        { cascade: ["remove"] }
    )
    session: Session[];

    @OneToMany(
        () => Resource,
        resource => resource.subject,
        { cascade: ["remove"] }
    )
    resource: Resource[];

    @OneToOne(
        () => LearningPath,
        learningPath => learningPath.subject
    )
    learningPath: LearningPath;
}
