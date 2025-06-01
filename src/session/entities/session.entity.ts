import { Student } from "src/student/entities/student.entity";
import { Subject } from "src/subject/entities/subject.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToMany(
        () => Subject,
        subject => subject.session,
        {onDelete: 'CASCADE'}
    )
    @JoinTable()
    subject: Student[];
}
