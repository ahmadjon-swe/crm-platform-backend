import { BaseEntity } from "src/database/entities/base-entity";
import { Roles } from "src/shared/enums/roles.enum";
import { Column, Entity } from "typeorm";

@Entity()
export class Auth extends BaseEntity{
  @Column({unique: true, type: "varchar"})
  username!: string

  @Column()
  name!: string

  @Column({unique: true, type: "varchar"})
  email!: string

  @Column({type: "varchar"})
  password!: string

  @Column({type: "enum", enum: Roles, default: Roles.ADMIN})
  role!: string
}
