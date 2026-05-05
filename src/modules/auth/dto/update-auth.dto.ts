import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class UpdateAuthDto {
  @IsString()
  @ApiProperty({default: "_alisher_1100"})
  username?: string
  
  @IsString()
  @ApiProperty({default: "Alisher Fayz"})
  name?: string

  @IsEmail()
  @ApiProperty({default: "muhammadalishuhratjonov50@gmail.com"})
  email?: string

  @IsString()
  @ApiProperty({default: "parol123"})
  password?: string
}
