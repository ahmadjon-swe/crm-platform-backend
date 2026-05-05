import { BaseEntity } from "src/database/entities/base-entity";
import { RolesAdmin } from "src/shared/enums/roles.enum";
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

  @Column({type: "enum", enum: RolesAdmin, default: RolesAdmin.ADMIN})
  role!: string

  @Column()
  refresh_token?: string

  @Column()
  otp?: string

  @Column({type: "bigint"})
  otp_time?: number
}
