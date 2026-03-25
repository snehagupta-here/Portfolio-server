import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { SEO, SEOSchema } from './nested-schema/seo.schema';
import { Author, AuthorSchema } from './nested-schema/author.schema';
import { Media, MediaSchema } from './nested-schema/media.schema';
import {
  ContentSection,
  ContentSectionSchema,
} from './nested-schema/content-section.schema';
import {
  ProjectMetadata,
  ProjectMetadataSchema,
} from './nested-schema/project-metadata.schema';
import {
  ApiMethodEnum,
  FolderStructureTypeEnum,
  PageAccessEnum,
  PageRenderingTypeEnum,
  PerformanceComplexityEnum,
  PerformanceStatusEnum,
  TestingTypeEnum,
} from 'src/enums/project.enum';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ _id: false })
export class TableColumn {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  type!: string;

  @Prop()
  constraints!: string;
}
export const TableColumnSchema = SchemaFactory.createForClass(TableColumn);

@Schema({ _id: false })
export class TableIndex {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ trim: true })
  reason?: string;

  @Prop({ type: [String], default: [] })
  columns!: string[];
}
export const TableIndexSchema = SchemaFactory.createForClass(TableIndex);

@Schema({ _id: false })
export class DatabaseTable {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: [TableColumnSchema], default: [] })
  columns!: TableColumn[];

  @Prop({ type: [TableIndexSchema], default: [] })
  indexes!: TableIndex[];
}
export const DatabaseTableSchema = SchemaFactory.createForClass(DatabaseTable);

@Schema({ _id: false })
export class DatabaseSchemaModel {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ type: [DatabaseTableSchema], default: [] })
  tables!: DatabaseTable[];
}
export const DatabaseSchemaModelSchema =
  SchemaFactory.createForClass(DatabaseSchemaModel);

@Schema({ _id: false })
export class Api {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  route!: string;

  @Prop({ trim: true, enum: ApiMethodEnum })
  method?: ApiMethodEnum;
}
export const ApiSchema = SchemaFactory.createForClass(Api);

@Schema({ _id: false })
export class ApiGroup {
  @Prop({ required: true, trim: true })
  groupName!: string;

  @Prop({ trim: true })
  basePath!: string;

  @Prop({ type: [ApiSchema], default: [] })
  apis!: Api[];
}
export const ApiGroupSchema = SchemaFactory.createForClass(ApiGroup);

@Schema({ _id: false })
export class ApiReferenceModel {
  @Prop({ required: true, trim: true })
  baseUrl!: string;

  @Prop({ trim: true })
  authentication?: string;

  @Prop({ type: [ApiGroupSchema], default: [] })
  apiGroup!: ApiGroup[];
}
export const ApiReferenceModelSchema =
  SchemaFactory.createForClass(ApiReferenceModel);

/* ---------------- performance ---------------- */

@Schema({ _id: false })
export class PerformanceTarget {
  @Prop({ trim: true })
  entity?: string;

  @Prop({ trim: true })
  scope?: string;
}
export const PerformanceTargetSchema =
  SchemaFactory.createForClass(PerformanceTarget);

@Schema({ _id: false })
export class PerformanceSettings {
  @Prop()
  ttl?: number;

  @Prop({ trim: true })
  ttlUnit?: string;

  @Prop({ trim: true })
  keyPattern?: string;
}
export const PerformanceSettingsSchema =
  SchemaFactory.createForClass(PerformanceSettings);

@Schema({ _id: false })
export class PerformanceConfiguration {
  @Prop({ trim: true })
  tool?: string;

  @Prop({ trim: true })
  strategy?: string;

  @Prop({ type: PerformanceSettingsSchema })
  settings?: PerformanceSettings;
}
export const PerformanceConfigurationSchema = SchemaFactory.createForClass(
  PerformanceConfiguration,
);

@Schema({ _id: false })
export class PerformanceMetrics {
  @Prop({ trim: true })
  expectedImprovement?: string;

  @Prop({
    type: String,
    enum: PerformanceComplexityEnum,
    trim: true,
  })
  complexityImpact?: PerformanceComplexityEnum;
}
export const PerformanceMetricsSchema =
  SchemaFactory.createForClass(PerformanceMetrics);

@Schema({ _id: false })
export class Performance {
  @Prop({ trim: true, unique: true })
  id?: string;

  @Prop({ trim: true })
  type?: string;

  @Prop({ trim: true })
  name?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  layer?: string;

  @Prop({ type: PerformanceTargetSchema })
  target?: PerformanceTarget;

  @Prop({ type: PerformanceConfigurationSchema })
  configuration?: PerformanceConfiguration;

  @Prop({ type: [String], default: [] })
  triggers!: string[];

  @Prop({ type: PerformanceMetricsSchema })
  metrics?: PerformanceMetrics;

  @Prop({
    type: String,
    enum: PerformanceStatusEnum,
    trim: true,
  })
  status?: PerformanceStatusEnum;
}
export const PerformanceSchema = SchemaFactory.createForClass(Performance);

/* ---------------- testing ---------------- */

@Schema({ _id: false })
export class TestingTarget {
  @Prop({ type: [String], default: undefined })
  scope?: string[];

  @Prop({ trim: true })
  filePattern?: string;
}
export const TestingTargetSchema = SchemaFactory.createForClass(TestingTarget);

@Schema({ _id: false })
export class TestingConfiguration {
  @Prop({ trim: true })
  environment?: string;

  @Prop({ trim: true })
  mocking?: string;

  @Prop({ trim: true })
  databaseReset?: string;
}
export const TestingConfigurationSchema =
  SchemaFactory.createForClass(TestingConfiguration);

@Schema({ _id: false })
export class TestingCoverage {
  @Prop()
  targetPercentage?: number;

  @Prop({ type: [String], default: [] })
  focusAreas!: string[];
}
export const TestingCoverageSchema =
  SchemaFactory.createForClass(TestingCoverage);

@Schema({ _id: false })
export class Testing {
  @Prop({ trim: true })
  id?: string;

  @Prop({ trim: true, type: String, enum: TestingTypeEnum })
  type?: TestingTypeEnum;

  @Prop({ trim: true })
  name?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  layer?: string;

  @Prop({ type: [String], default: [] })
  tools!: string[];

  @Prop({ type: TestingTargetSchema })
  target?: TestingTarget;

  @Prop({ type: TestingConfigurationSchema })
  configuration?: TestingConfiguration;

  @Prop({ type: TestingCoverageSchema })
  coverage?: TestingCoverage;

  @Prop({ trim: true })
  status?: string;
}
export const TestingSchema = SchemaFactory.createForClass(Testing);

/* ---------------- folder structure ---------------- */

@Schema({ _id: false })
export class FolderNode {
  @Prop({ trim: true })
  id?: string;

  @Prop({ trim: true })
  name?: string;

  @Prop({ trim: true, type: String, enum: FolderStructureTypeEnum })
  type?: FolderStructureTypeEnum;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: [Object], default: [] })
  children!: FolderNode[];
}
export const FolderNodeSchema = SchemaFactory.createForClass(FolderNode);

/* ---------------- pages ---------------- */

@Schema({ _id: false })
export class PageSection {
  @Prop({ trim: true })
  name?: string;

  @Prop({ trim: true })
  description?: string;
}
export const PageSectionSchema = SchemaFactory.createForClass(PageSection);

@Schema({ _id: false })
export class ProjectPage {
  @Prop({ trim: true })
  id?: string;

  @Prop({ trim: true })
  name?: string;

  @Prop({ trim: true })
  route?: string;

  @Prop({ trim: true, enum: PageAccessEnum, type: String })
  access?: PageAccessEnum;

  @Prop({ trim: true })
  layout?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  purpose?: string;

  @Prop({ type: [PageSectionSchema], default: [] })
  sections!: PageSection[];

  @Prop({ trim: true, enum: PageRenderingTypeEnum, type: String })
  rendering?: PageRenderingTypeEnum;
}
export const ProjectPageSchema = SchemaFactory.createForClass(ProjectPage);

/* ---------------- cicd ---------------- */

@Schema({ _id: false })
export class PipelineStep {
  @Prop()
  step?: number;

  @Prop({ trim: true })
  name?: string;

  @Prop({ trim: true })
  command?: string;
}
export const PipelineStepSchema = SchemaFactory.createForClass(PipelineStep);

@Schema({ _id: false })
export class CiCd {
  @Prop({ trim: true })
  tool?: string;

  @Prop({ trim: true })
  trigger?: string;

  @Prop({ type: [PipelineStepSchema], default: [] })
  pipeline!: PipelineStep[];

  @Prop({ trim: true })
  blockers?: string;
}
export const CiCdSchema = SchemaFactory.createForClass(CiCd);

/* ---------------- deployment ---------------- */

@Schema({ _id: false })
export class DeploymentDetail {
  @Prop({ trim: true })
  url?: string;

  @Prop({ trim: true })
  platform?: string;
}
export const DeploymentDetailSchema =
  SchemaFactory.createForClass(DeploymentDetail);

@Schema({ _id: false })
export class Deployment {
  @Prop({ trim: true })
  type?: string;

  @Prop({ type: [DeploymentDetailSchema], default: [] })
  details!: DeploymentDetail[];
}
export const DeploymentSchema = SchemaFactory.createForClass(Deployment);

/* ---------------- environment variables ---------------- */

@Schema({ _id: false })
export class EnvironmentVariableItem {
  @Prop({ trim: true })
  key?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  example?: string;
}
export const EnvironmentVariableItemSchema = SchemaFactory.createForClass(
  EnvironmentVariableItem,
);

@Schema({ _id: false })
export class EnvironmentVariableGroup {
  @Prop({ trim: true })
  type?: string;

  @Prop({ type: [EnvironmentVariableItemSchema], default: [] })
  variable!: EnvironmentVariableItem[];
}
export const EnvironmentVariableGroupSchema = SchemaFactory.createForClass(
  EnvironmentVariableGroup,
);

/* ---------------- project ---------------- */

@Schema({ collection: 'projects', timestamps: true })
export class Project extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, unique: true, trim: true })
  slug!: string;

  @Prop({ trim: true })
  tagline!: string;

  @Prop({ trim: true })
  description!: string;

  @Prop({ trim: true })
  github!: string;

  @Prop({ type: [ContentSectionSchema], default: [] })
  content!: ContentSection[];

  @Prop({ type: [DatabaseSchemaModelSchema], default: [] })
  databases!: DatabaseSchemaModel[];

  @Prop({ type: ApiReferenceModelSchema, default: {} })
  apis!: ApiReferenceModel;

  @Prop({
    type: [{ title: String, description: String }],
    default: [],
  })
  futureImprovements!: { title: string; description: string }[];

  @Prop({ trim: true })
  liveUrl!: string;

  @Prop({ type: AuthorSchema })
  author!: Author;

  @Prop({ type: ProjectMetadataSchema })
  metadata!: ProjectMetadata;

  @Prop({ type: SEOSchema })
  seo!: SEO;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ type: [PerformanceSchema], default: [] })
  performance!: Performance[];

  @Prop({ type: [TestingSchema], default: [] })
  testing!: Testing[];

  @Prop({ type: MediaSchema })
  media!: Media;

  @Prop({ type: [FolderNodeSchema], default: [] })
  folderStructure!: FolderNode[];

  @Prop({ type: [ProjectPageSchema], default: [] })
  pages!: ProjectPage[];

  @Prop({ type: CiCdSchema, default: {} })
  cicd!: CiCd;

  @Prop({ type: [DeploymentSchema], default: [] })
  deployment!: Deployment[];

  @Prop({ type: [EnvironmentVariableGroupSchema], default: [] })
  environmentVariables!: EnvironmentVariableGroup[];

  @Prop()
  githubRepositoryUrl!: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
