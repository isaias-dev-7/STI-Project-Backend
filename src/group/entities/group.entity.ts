import { Subject } from "src/subject/entities/subject.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 8, nullable: false })
    key: string;

    @Column({ type: 'varchar', length: 225, nullable: false})
    name: string;

    @ManyToOne(
        () => Subject,
        subject => subject.group,
        { nullable: true, onDelete: "CASCADE" } 
    )
    subject: Subject;

    @ManyToMany(
        () => User,
        user => user.group
    )
    @JoinTable()
    user: User[];
}
