import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 6, nullable: false})
    group: string;

    @Column({ type: 'numeric', nullable: false})
    academicYear: number;

   @ManyToOne(
    () => User,
    user => user.student,
    { onDelete: 'CASCADE'}
   )
   user: User;
}
