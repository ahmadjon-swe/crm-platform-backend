import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class UpdateAuthDto {
  @IsString()
  @ApiProperty({default: "yordamchi_admin"})
  username?: string
  
  @IsString()
  @ApiProperty({default: "yordamchi_admin"})
  name?: string

  @IsEmail()
  @ApiProperty({default: "example@gmail.com"})
  email?: string

  @IsString()
  @ApiProperty({default: "parol123"})
  password?: string
}
