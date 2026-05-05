import { BaseEntity } from "src/database/entities/base-entity";
import { Auth } from "src/modules/auth/entities/auth.entity";
import { Student } from "src/modules/student/entities/student.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
  TRANSFER = "transfer",
}

@Entity()
export class Payment extends BaseEntity {
  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: "enum", enum: PaymentMethod, default: PaymentMethod.CASH })
  method!: PaymentMethod;

  @Column({ type: "varchar", nullable: true })
  description?: string;

  // Which month this payment is for (e.g. 2025-05)
  @Column({ type: "varchar", length: 7 })
  month!: string;

  @ManyToOne(() => Student, (student) => student.payments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "student_id" })
  student: Student;

  // Admin who registered this payment
  @ManyToOne(() => Auth, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "admin_id" })
  admin: Auth;
}