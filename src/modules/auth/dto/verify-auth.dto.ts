import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class VerifyAuthDto {
  @IsString()
  @ApiProperty({default: "user or email"})
  login!: string

  @IsString()
  @ApiProperty({default: "123456"})
  otp!: string
}
