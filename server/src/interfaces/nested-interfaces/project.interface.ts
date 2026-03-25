/* ---------------- database ---------------- */

export interface TableColumnInput {
  name: string;
  type: string;
  constraints?: string;
}

export interface TableIndexInput {
  name: string;
  reason?: string;
  columns?: string[];
}

export interface DatabaseTableInput {
  name: string;
  description?: string;
  columns?: TableColumnInput[];
  indexes?: TableIndexInput[];
}

export interface DatabaseSchemaModelInput {
  name: string;
  tables?: DatabaseTableInput[];
}

/* ---------------- apis ---------------- */

export interface ApiInput {
  name: string;
  route: string;
  method?: string;
}

export interface ApiGroupInput {
  groupName: string;
  basePath?: string;
  apis?: ApiInput[];
}

export interface ApiReferenceModelInput {
  baseUrl: string;
  authentication?: string;
  apiGroup?: ApiGroupInput[];
}

/* ---------------- performance ---------------- */

export interface PerformanceTargetInput {
  entity?: string;
  scope?: string;
}

export interface PerformanceSettingsInput {
  ttl?: number;
  ttlUnit?: string;
  keyPattern?: string;
}

export interface PerformanceConfigurationInput {
  tool?: string;
  strategy?: string;
  settings?: PerformanceSettingsInput;
}

export interface PerformanceMetricsInput {
  expectedImprovement?: string;
  complexityImpact?: string;
}

export interface PerformanceInput {
  id?: string;
  type?: string;
  name?: string;
  description?: string;
  layer?: string;
  target?: PerformanceTargetInput;
  configuration?: PerformanceConfigurationInput;
  triggers?: string[];
  metrics?: PerformanceMetricsInput;
  status?: string;
}

/* ---------------- testing ---------------- */

export interface TestingTargetInput {
  scope?: string[];
  filePattern?: string;
}

export interface TestingConfigurationInput {
  environment?: string;
  mocking?: string;
  databaseReset?: string;
}

export interface TestingCoverageInput {
  targetPercentage?: number;
  focusAreas?: string[];
}

export interface TestingInput {
  id?: string;
  type?: string;
  name?: string;
  description?: string;
  layer?: string;
  tools?: string[];
  target?: TestingTargetInput;
  configuration?: TestingConfigurationInput;
  coverage?: TestingCoverageInput;
  status?: string;
}

/* ---------------- folder structure ---------------- */

export interface FolderNodeInput {
  id?: string;
  name?: string;
  type?: string;
  description?: string;
  children?: FolderNodeInput[];
}

/* ---------------- pages ---------------- */

export interface PageSectionInput {
  name?: string;
  description?: string;
}

export interface ProjectPageInput {
  id?: string;
  name?: string;
  route?: string;
  access?: string;
  layout?: string;
  description?: string;
  purpose?: string;
  sections?: PageSectionInput[];
  rendering?: string;
}

/* ---------------- cicd ---------------- */

export interface PipelineStepInput {
  step?: number;
  name?: string;
  command?: string;
}

export interface CiCdInput {
  tool?: string;
  trigger?: string;
  pipeline?: PipelineStepInput[];
  blockers?: string;
}

/* ---------------- deployment ---------------- */

export interface DeploymentDetailInput {
  url?: string;
  platform?: string;
}

export interface DeploymentInput {
  type?: string;
  details?: DeploymentDetailInput[];
}

/* ---------------- environment variables ---------------- */

export interface EnvironmentVariableItemInput {
  key?: string;
  description?: string;
  example?: string;
}

export interface EnvironmentVariableGroupInput {
  type?: string;
  variable?: EnvironmentVariableItemInput[];
}

/* ---------------- misc ---------------- */

export interface TitleDescriptionInput {
  title: string;
  description: string;
}