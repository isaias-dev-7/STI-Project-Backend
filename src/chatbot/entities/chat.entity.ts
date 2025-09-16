import { Student } from "../../student/entities/student.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;
 
    @Column({ type: 'bigint', nullable: false })
    createAtMessageStudent: number;

    @Column({ type: 'bigint', nullable: false })
    createAtMessageBot: number;

    @Column({ type: 'text', nullable: false})
    messageStudent: string;

    @Column({ type: 'text', nullable: false})
    messageBot: string;

    @ManyToOne(
        () => Student,
        student => student.chat,
        { onDelete: 'CASCADE'}
    )
    student: Student;
}