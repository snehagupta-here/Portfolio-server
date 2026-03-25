import {
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsEnum,
  IsDateString,
  IsNumber,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SectionTypeEnum, ContentTypeEnum } from 'src/enums';

class CodeSnippetDto {
  @IsString()
  language!: string;

  @IsString()
  code!: string;

  @IsString()
  description!: string;

  @IsString()
  filename!: string;
}

class PointDto {
  @IsString()
  label!: string;

  @IsString()
  description!: string;
}

class FAQDto {
  @IsString()
  question!: string;

  @IsString()
  answer!: string;
}

class SubItemDto {
  @IsString()
  subHeading!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  points?: string[];

  // image URLs allowed here
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CodeSnippetDto)
  codeSnippet?: CodeSnippetDto[];
}

export class ContentSectionDto {
  @IsString()
  id!: string;

  @IsEnum(ContentTypeEnum)
  contentType!: ContentTypeEnum;

  @IsEnum(SectionTypeEnum)
  type!: SectionTypeEnum;

  @IsOptional()
  @IsString()
  heading?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  paragraphs?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PointDto)
  points?: PointDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubItemDto)
  items?: SubItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FAQDto)
  questions?: FAQDto[];

  // image URLs allowed here
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CodeSnippetDto)
  codeSnippet?: CodeSnippetDto[];
}

export class MediaDto {
  @IsOptional()
  @IsString()
  type?: string;

  // image URL allowed
  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  // image URL allowed
  @IsOptional()
  @IsUrl()
  banner?: string;
}

export class AuthorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  github?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;
}

export class MetadataDto {
  @IsOptional()
  @IsDateString()
  publishedDate?: string;

  @IsOptional()
  @IsDateString()
  lastModified?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsNumber()
  readTime?: number;
}

export class SEODto {
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
}