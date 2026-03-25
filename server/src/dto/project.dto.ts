import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import {
  ContentSectionDto,
  MediaDto,
  AuthorDto,
  MetadataDto,
  SEODto,
} from './common.dto';
import {
  DatabaseSchemaModelDto,
  ApiReferenceModelDto,
  TitleDescriptionDto,
  PerformanceDto,
  TestingDto,
  FolderNodeDto,
  ProjectPageDto,
  CiCdDto,
  DeploymentDto,
  EnvironmentVariableGroupDto,
} from './nested-dto/project.dto';
DatabaseSchemaModelDto;

/* -------------------- create dto -------------------- */

export class CreateProjectDto {
  @IsMongoId()
  @IsNotEmpty()
  user_id!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  github?: string;

  @IsOptional()
  @IsString()
  liveUrl?: string;

  @IsOptional()
  @IsString()
  githubRepositoryUrl?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentSectionDto)
  content?: ContentSectionDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DatabaseSchemaModelDto)
  databases?: DatabaseSchemaModelDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ApiReferenceModelDto)
  apis?: ApiReferenceModelDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TitleDescriptionDto)
  futureImprovements?: TitleDescriptionDto[];

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PerformanceDto)
  performance?: PerformanceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestingDto)
  testing?: TestingDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FolderNodeDto)
  folderStructure?: FolderNodeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectPageDto)
  pages?: ProjectPageDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CiCdDto)
  cicd?: CiCdDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeploymentDto)
  deployment?: DeploymentDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnvironmentVariableGroupDto)
  environmentVariables?: EnvironmentVariableGroupDto[];
}

/* -------------------- update dto -------------------- */

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  github?: string;

  @IsOptional()
  @IsString()
  liveUrl?: string;

  @IsOptional()
  @IsString()
  githubRepositoryUrl?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentSectionDto)
  content?: ContentSectionDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DatabaseSchemaModelDto)
  databases?: DatabaseSchemaModelDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ApiReferenceModelDto)
  apis?: ApiReferenceModelDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TitleDescriptionDto)
  futureImprovements?: TitleDescriptionDto[];

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PerformanceDto)
  performance?: PerformanceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestingDto)
  testing?: TestingDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FolderNodeDto)
  folderStructure?: FolderNodeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectPageDto)
  pages?: ProjectPageDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CiCdDto)
  cicd?: CiCdDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeploymentDto)
  deployment?: DeploymentDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnvironmentVariableGroupDto)
  environmentVariables?: EnvironmentVariableGroupDto[];
}
