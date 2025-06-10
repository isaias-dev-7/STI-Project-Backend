import { Subject } from "src/subject/entities/subject.entity";
import { Resource } from "../../resource/entities/resource.entity";
import { User } from "../../user/entities/user.entity";
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LearningPath {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(
        () => Resource,
        resource => resource.learningPath
    )
    resource: Resource[];

    @OneToOne(
        () => User,
        user => user.learningPath
    )
    @JoinColumn()
    user: User;

    @OneToOne(
        () => Subject,
        subject => subject.learningPath
    )
    @JoinColumn()
    subject: Subject;
}
