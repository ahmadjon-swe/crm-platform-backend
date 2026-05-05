import { BaseEntity } from "src/database/entities/base-entity";
import { Attendance } from "src/modules/attendance/entities/attendance.entity";
import { Student } from "src/modules/student/entities/student.entity";
import { Teacher } from "src/modules/teacher/entities/teacher.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

export enum WeekDays {
  ODD = "odd",     // Toq kunlar: Du, Chor, Ju
  EVEN = "even",   // Juft kunlar: Se, Pay, Sha
}

export enum LessonTime {
  MORNING = "10:00-12:00",
  AFTERNOON = "14:30-16:30",
  EVENING = "17:00-19:00",
}

@Entity()
export class Group extends BaseEntity {
  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar" })
  direction!: string;

  @Column({ type: "enum", enum: WeekDays })
  week_days!: WeekDays;

  @Column({ type: "enum", enum: LessonTime })
  lesson_time!: LessonTime;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  monthly_fee!: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.groups, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "teacher_id" })
  teacher: Teacher;

  @ManyToMany(() => Student, (student) => student.groups)
  @JoinTable({
    name: "group_students",
    joinColumn: { name: "group_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "student_id", referencedColumnName: "id" },
  })
  students: Student[];

  @OneToMany(() => Attendance, (attendance) => attendance.group)
  attendances: Attendance[];
}