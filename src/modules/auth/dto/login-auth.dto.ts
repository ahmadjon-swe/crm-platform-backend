import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginAuthDto {
  @IsString()
  @ApiProperty({default: "muhammadalishuhratjonov50@gmail.com"})
  login!: string

  @IsString()
  @ApiProperty({default: "parol123"})
  password!: string
}
