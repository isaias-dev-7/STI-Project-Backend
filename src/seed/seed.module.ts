import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Professor } from 'src/professor/entities/professor.entity';
import { Student } from 'src/student/entities/student.entity';
import { Subject } from 'src/subject/entities/subject.entity';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Professor,
            Student,
            Subject
        ])
    ],
    providers: [ SeedService ],
    exports: [SeedService]
})
export class SeedModule {}
