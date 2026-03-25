import {
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ContentSectionDto,
  MediaDto,
  AuthorDto,
  MetadataDto,
  SEODto,
} from './common.dto';

export class CreateBlogDto {
  @IsMongoId()
  @IsNotEmpty()
  user_id!: string;

  @IsString()
  title!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentSectionDto)
  content?: ContentSectionDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaDto)
  media?: MediaDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AuthorDto)
  author?: AuthorDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata?: MetadataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SEODto)
  seo?: SEODto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentSectionDto)
  content?: ContentSectionDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaDto)
  media?: MediaDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AuthorDto)
  author?: AuthorDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata?: MetadataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SEODto)
  seo?: SEODto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
