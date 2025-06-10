import { LearningPath } from "../../learning-path/entities/learning-path.entity";
import { Resource } from "../../resource/entities/resource.entity";
import { Subject } from "../../subject/entities/subject.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Session {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true})
    description: string;

    @Column({ type: 'varchar', length: 225, nullable: false })
    name: string;

    @Column({ type: 'numeric', nullable: false, unique: true })
    numberSession: number;

    @ManyToOne(
        () => Subject,
        subject => subject.session,
        {onDelete: 'CASCADE'}
    )
    subject: Subject;

    @OneToMany(
        () => Resource,
        resource => resource.session
    )
    resource: Resource[];
}
