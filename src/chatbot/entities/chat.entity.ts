import { Entity } from "typeorm";

@Entity()
export class Chat {
    id: number;
 
    createAt: number;

    message: string;
}