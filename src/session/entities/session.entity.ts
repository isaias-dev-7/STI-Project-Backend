import { Subject } from "src/subject/entities/subject.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
}
