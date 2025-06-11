import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LearningPath } from "../entities/learning-path.entity";
import { Repository } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Resource } from "../../resource/entities/resource.entity";
import { Subject } from "../../subject/entities/subject.entity";
import { UserModel } from "../../user/model/user.model";
import { SubjectModel } from "../../subject/model/subject.model";
import { ResourceModel } from "../../resource/model/resource.model";
import { typeResourceEnum } from "../../resource/enums/typeResource.enum";

@Injectable()
export class LearningPathModel {
    constructor(
        @InjectRepository(LearningPath) private readonly learningPathRepository: Repository<LearningPath>,
        private readonly userModel: UserModel,
        private readonly subjectModel: SubjectModel,
        private readonly resourceModel: ResourceModel
    ) { }

    private async createLearningPath(
        user: User,
        resources: Resource[],
        subject: Subject
    ) {
        try {
            const path = this.learningPathRepository.create({
                user,
                resource: resources,
                subject
            });
            await this.learningPathRepository.save(path);
            return true;
        } catch (error) {
            this.handleException('createLearningPath', error);
        }
    }

    async buildingPath(user: User, subjectId: number) {
        try {
            const subject = await this.subjectModel.getSubjectById(subjectId);
           
            if (await this.learningPathRepository.findOne({ where: { user, subject } }))
                return this.getLearningPath(user, subject);

            let resources: Resource[] = [];
            const style = [typeResourceEnum.REFLEXIVE, typeResourceEnum.PRAGMATIC, typeResourceEnum.THEORETICAL];
            const { student } = await this.userModel.getUserbyId(user.id);
            const { learningStyle } = student;
            const sessionsWithResources = await this.resourceModel.getAllResourcesBySubject(subject);

            for (const key of Object.keys(sessionsWithResources).map(Number)) {
               
                let flag = sessionsWithResources[key].some(r => {
                    const typeStyle = this.getRandomElement(style, learningStyle).toString();
                    if (r.type == typeStyle) {
                        resources.push(r);
                        return true;
                    }
                });

                if (!flag) resources.push(sessionsWithResources[key][0]);
            }

            await this.createLearningPath(user, resources, subject);
            return this.getLearningPath(user, subject);
        } catch (error) {
            this.handleException('buildingPath', error);
        }
    }

    private getLearningPath(user: User, subject: Subject) {
        try {
            const path = this.learningPathRepository.find({
                where: { user, subject },
                relations: ['resource']
            });

            return path;
        } catch (error) {
            this.handleException('getLearningPath', error);
        }
    }

    private getRandomElement(elements: typeResourceEnum[], probabilities: string) {
        const probs = probabilities.split(",").map(Number);
        const total = probs.reduce((sum, p) => sum + p, 0);

        const random = Math.random() * total;
        let cumulative = 0;

        for (let i = 0; i < 3; i++) {
            cumulative += probs[i];
            if (random < cumulative) {
                return elements[i];
            }
        }

        return elements[2];
    }


    private handleException(description: string, error: any) {
        console.error(`[ERROR] - ${description} - /learning-path/model/learning-path.model.ts`);
        console.error({ error });
        throw error;
    }
}