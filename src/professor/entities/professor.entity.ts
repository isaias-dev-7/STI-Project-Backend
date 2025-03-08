import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Professor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: false})
    subject: string;

    @ManyToOne(
        () => User, 
        user => user.professor,
        { onDelete: 'CASCADE'}
    )
    user: User;
}
