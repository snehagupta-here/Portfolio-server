import {
  IsArray,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SocialLinkDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsString()
  url!: string;
}

class UserFileAssetDto {
  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  publicId?: string;

  @IsOptional()
  @IsString()
  secureUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  width?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  height?: number;

  @IsOptional()
  @IsString()
  format?: string;

  @IsOptional()
  @IsString()
  resourceType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bytes?: number;

  @IsOptional()
  @IsString()
  originalFilename?: string;
}

class UserHighlightDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;
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

export class SearchUserQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsMongoId()
  skill_id?: string;
}

export class EnvDto {
  @IsOptional()
  @IsString()
  githubToken?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserFileAssetDto)
  avatar?: UserFileAssetDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserFileAssetDto)
  aboutImage?: UserFileAssetDto;

  @IsOptional()
  @IsString()
  aboutHeading?: string;

  @IsOptional()
  @IsString()
  aboutBio?: string;

  @IsOptional()
  @IsString()
  totalYearsExperience?: string;

  @IsOptional()
  @IsString()
  projectsCompleted?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  paragraphs?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserHighlightDto)
  highlights?: UserHighlightDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserSkillDto)
  skills?: UserSkillDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => UserFileAssetDto)
  resume?: UserFileAssetDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EnvDto)
  env?: EnvDto;
}
