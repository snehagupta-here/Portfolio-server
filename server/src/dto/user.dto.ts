import {
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsUrl,
  IsMongoId,
  IsNumber,
  IsInt,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class SocialLinkDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsUrl()
  url!: string;
}

class UserSkillDto {
  @IsMongoId()
  skill_id!: string;

  @IsNumber()
  @Min(0)
  yoe!: number;

  @IsInt()
  @Min(0)
  @Max(10)
  scale!: number;
}

export class UserDto {
  @IsOptional()
  @IsString()
  about?: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  links?: SocialLinkDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserSkillDto)
  skills?: UserSkillDto[];
}