import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ApiMethodEnum,
  FolderStructureTypeEnum,
  PageAccessEnum,
  PageRenderingTypeEnum,
  PerformanceComplexityEnum,
  PerformanceStatusEnum,
  TestingTypeEnum,
} from 'src/enums/project.enum';

export class TableColumnDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsOptional()
  @IsString()
  constraints?: string;
}

export class TableIndexDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  columns?: string[];
}

export class DatabaseTableDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TableColumnDto)
  columns?: TableColumnDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TableIndexDto)
  indexes?: TableIndexDto[];
}

export class DatabaseSchemaModelDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DatabaseTableDto)
  tables?: DatabaseTableDto[];
}

export class ApiDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  route!: string;

  @IsOptional()
  @IsEnum(ApiMethodEnum)
  method?: ApiMethodEnum;
}

export class ApiGroupDto {
  @IsString()
  @IsNotEmpty()
  groupName!: string;

  @IsString()
  @IsOptional()
  basePath?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApiDto)
  apis?: ApiDto[];
}

export class ApiReferenceModelDto {
  @IsString()
  @IsNotEmpty()
  baseUrl!: string;

  @IsOptional()
  @IsString()
  authentication?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApiGroupDto)
  apiGroup?: ApiGroupDto[];
}

export class TitleDescriptionDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
}

/* -------------------- performance dto -------------------- */

export class PerformanceTargetDto {
  @IsOptional()
  @IsString()
  entity?: string;

  @IsOptional()
  @IsString()
  scope?: string;
}

export class PerformanceSettingsDto {
  @IsOptional()
  @IsNumber()
  ttl?: number;

  @IsOptional()
  @IsString()
  ttlUnit?: string;

  @IsOptional()
  @IsString()
  keyPattern?: string;
}

export class PerformanceConfigurationDto {
  @IsOptional()
  @IsString()
  tool?: string;

  @IsOptional()
  @IsString()
  strategy?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PerformanceSettingsDto)
  settings?: PerformanceSettingsDto;
}

export class PerformanceMetricsDto {
  @IsOptional()
  @IsString()
  expectedImprovement?: string;

  @IsOptional()
  @IsEnum(PerformanceComplexityEnum)
  complexityImpact?: PerformanceComplexityEnum;
}

export class PerformanceDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  layer?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PerformanceTargetDto)
  target?: PerformanceTargetDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PerformanceConfigurationDto)
  configuration?: PerformanceConfigurationDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  triggers?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PerformanceMetricsDto)
  metrics?: PerformanceMetricsDto;

  @IsOptional()
  @IsEnum(PerformanceStatusEnum)
  status?: PerformanceStatusEnum;
}

/* -------------------- testing dto -------------------- */

export class TestingTargetDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scope?: string[];

  @IsOptional()
  @IsString()
  filePattern?: string;
}

export class TestingConfigurationDto {
  @IsOptional()
  @IsString()
  environment?: string;

  @IsOptional()
  @IsString()
  mocking?: string;

  @IsOptional()
  @IsString()
  databaseReset?: string;
}

export class TestingCoverageDto {
  @IsOptional()
  @IsNumber()
  targetPercentage?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  focusAreas?: string[];
}

export class TestingDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsEnum(TestingTypeEnum)
  type?: TestingTypeEnum;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  layer?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tools?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => TestingTargetDto)
  target?: TestingTargetDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TestingConfigurationDto)
  configuration?: TestingConfigurationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TestingCoverageDto)
  coverage?: TestingCoverageDto;

  @IsOptional()
  @IsString()
  status?: string;
}

/* -------------------- folder structure dto -------------------- */

export class FolderNodeDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(FolderStructureTypeEnum)
  type?: FolderStructureTypeEnum;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FolderNodeDto)
  children?: FolderNodeDto[];
}

/* -------------------- pages dto -------------------- */

export class PageSectionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class ProjectPageDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  route?: string;

  @IsOptional()
  @IsEnum(PageAccessEnum)
  access?: PageAccessEnum;

  @IsOptional()
  @IsString()
  layout?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageSectionDto)
  sections?: PageSectionDto[];

  @IsOptional()
  @IsEnum(PageRenderingTypeEnum)
  rendering?: PageRenderingTypeEnum;
}

/* -------------------- cicd dto -------------------- */

export class PipelineStepDto {
  @IsOptional()
  @IsNumber()
  step?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  command?: string;
}

export class CiCdDto {
  @IsOptional()
  @IsString()
  tool?: string;

  @IsOptional()
  @IsString()
  trigger?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PipelineStepDto)
  pipeline?: PipelineStepDto[];

  @IsOptional()
  @IsString()
  blockers?: string;
}

/* -------------------- deployment dto -------------------- */

export class DeploymentDetailDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  platform?: string;
}

export class DeploymentDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeploymentDetailDto)
  details?: DeploymentDetailDto[];
}

/* -------------------- environment variables dto -------------------- */

export class EnvironmentVariableItemDto {
  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  example?: string;
}

export class EnvironmentVariableGroupDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnvironmentVariableItemDto)
  variable?: EnvironmentVariableItemDto[];
}