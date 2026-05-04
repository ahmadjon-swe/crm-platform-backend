import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { StudentModule } from './modules/student/student.module';
import { GroupModule } from './modules/group/group.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Auth } from './modules/auth/entities/auth.entity';
import { Group } from './modules/group/entities/group.entity';
import { Student } from './modules/student/entities/student.entity';
import { Teacher } from './modules/teacher/entities/teacher.entity';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: ".env", isGlobal: true}),
    TypeOrmModule.forRoot({
      type: "postgres",
      username: "postgres",
      port: 5432,
      host: "localhost",
      entities: [Auth, Group, Student, Teacher],
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true
    }),
    AuthModule, 
    TeacherModule, 
    StudentModule, 
    GroupModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
