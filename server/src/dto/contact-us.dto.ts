import { IsOptional, IsString } from '@nestjs/class-validator';
export class ContactUsBody {
  @IsString()
  name!: string;

  @IsString()
  email!: string;

  @IsOptional()
  @IsString()
  organization!: string;

  @IsString()
  message!: string
}
