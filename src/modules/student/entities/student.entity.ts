import { BaseEntity } from "src/database/entities/base-entity";
import { Attendance } from "src/modules/attendance/entities/attendance.entity";
import { Group } from "src/modules/group/entities/group.entity";
import { Payment } from "src/modules/payment/entities/payment.entity";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";

@Entity()
export class Student extends BaseEntity {
  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", unique: true })
  phone!: string;

  @Column({ type: "varchar" })
  parent_name!: string;

  @Column({ type: "varchar" })
  parent_phone!: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  balance!: number;

  @ManyToMany(() => Group, (group) => group.students)
  groups: Group[];

  @OneToMany(() => Payment, (payment) => payment.student)
  payments: Payment[];

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances: Attendance[];
}