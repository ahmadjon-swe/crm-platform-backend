import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateAuthDto {
  @IsString()
  @ApiProperty({default: "ozzod_1"})
  username!: string

  @IsString()
  @ApiProperty({default: "Ozodbek Nazarbekov"})
  name!: string

  @IsEmail()
  @ApiProperty({default: "muhammadalishuhratjonov50@gmail.com"})
  email!: string

  @IsString()
  @ApiProperty({default: "parol123"})
  password!: string
}
