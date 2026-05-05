import { BaseEntity } from "src/database/entities/base-entity";
import { Auth } from "src/modules/auth/entities/auth.entity";
import { Group } from "src/modules/group/entities/group.entity";
import { Student } from "src/modules/student/entities/student.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";


export enum AttendanceStatus {
  PRESENT = "present",
  ABSENT = "absent",
  LATE = "late",
}

@Entity()
export class Attendance extends BaseEntity {
  @Column({ type: "date" })
  date!: string;

  @Column({ type: "enum", enum: AttendanceStatus, default: AttendanceStatus.PRESENT })
  status!: AttendanceStatus;

  @ManyToOne(() => Student, (student) => student.attendances, { onDelete: "CASCADE" })
  @JoinColumn({ name: "student_id" })
  student: Student;

  @ManyToOne(() => Group, (group) => group.attendances, { onDelete: "CASCADE" })
  @JoinColumn({ name: "group_id" })
  group: Group;

  // Admin who marked attendance
  @ManyToOne(() => Auth, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "admin_id" })
  admin: Auth;
}