import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Professor } from '../professor/entities/professor.entity';
import { Student } from '../student/entities/student.entity';
import { Subject } from '../subject/entities/subject.entity';
import { Group } from 'src/group/entities/group.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Professor,
            Student,
            Subject,
            Group
        ])
    ],
    providers: [ SeedService ],
    exports: [SeedService]
})
export class SeedModule {}
