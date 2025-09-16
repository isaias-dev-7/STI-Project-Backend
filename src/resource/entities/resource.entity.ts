import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Subject } from "../../subject/entities/subject.entity";
import { Session } from "src/session/entities/session.entity";
import { LearningPath } from "src/learning-path/entities/learning-path.entity";

@Entity()
export class Resource {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 225, nullable: false })
    url: string;

    @Column({ type: "varchar", nullable: false })
    type: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @ManyToOne(
        () => Subject,
        subject => subject.resource,
        { onDelete: "CASCADE" }
    )
    subject: Subject;

    @ManyToOne(
        () => Session,
        session => session.resource,
        { nullable: true }
    )
    session: Session;

    @ManyToOne(
        () => LearningPath,
        learningPath => learningPath.resource
    )
    learningPath: LearningPath;
}
