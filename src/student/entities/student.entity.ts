import { Chat } from "src/chatbot/entities/chat.entity";
import { curseEnum } from "src/common/enums/curseEnum";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 6, nullable: false })
    group: string;

    @Column({ type:'enum', enum: curseEnum , nullable: false })
    curseType: string;

    @Column({ type: 'numeric', nullable: false})
    academicYear: number;

    @Column({ type: 'varchar', length: 225}) 
    learningStyle: string;

    @Column({ type: 'boolean', nullable: false, default: true })
    firtsTime: boolean;

   @OneToOne(
    () => User,
    user => user.student,
    { onDelete: 'CASCADE' }
   )
   user: User;

   @OneToMany(
    () => Chat,
    chat => chat.student,
    { nullable: true }
   )
   chat: Chat[]
}
