import { BaseEntity } from "src/database/entities/base-entity";
import { Group } from "src/modules/group/entities/group.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Teacher extends BaseEntity {
  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", unique: true })
  phone!: string;

  @Column({ type: "varchar", nullable: true })
  image?: string;

  @Column({ type: "varchar" })
  direction!: string;

  @OneToMany(() => Group, (group) => group.teacher)
  groups: Group[];
}