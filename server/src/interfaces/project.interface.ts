import {
  ContentSectionInput,
  MediaInput,
  AuthorInput,
  MetadataInput,
  SEOInput,
} from './common.interface';
import {
  DatabaseSchemaModelInput,
  TitleDescriptionInput,
  PerformanceInput,
  ProjectPageInput,
  FolderNodeInput,
  DeploymentInput,
  EnvironmentVariableGroupInput,
  ApiReferenceModelInput,
  TestingInput,
  CiCdInput,
} from './nested-interfaces/project.interface';

/* ---------------- root project inputs ---------------- */

export interface ResolvedProjectInput {
  user_id: string;
  title: string;
  slug: string;
  tagline?: string;
  description?: string;
  github?: string;
  liveUrl?: string;
  githubRepositoryUrl?: string;
  content?: ContentSectionInput[];
  databases?: DatabaseSchemaModelInput[];
  apis?: ApiReferenceModelInput;
  futureImprovements?: TitleDescriptionInput[];
  author?: AuthorInput;
  metadata?: MetadataInput;
  seo?: SEOInput;
  isActive?: boolean;
  performance?: PerformanceInput[];
  testing?: TestingInput[];
  media?: MediaInput;
  folderStructure?: FolderNodeInput[];
  pages?: ProjectPageInput[];
  cicd?: CiCdInput;
  deployment?: DeploymentInput[];
  environmentVariables?: EnvironmentVariableGroupInput[];
}

export interface ResolvedProjectUpdateInput {
  user_id?: string;
  title?: string;
  slug?: string;
  tagline?: string;
  description?: string;
  github?: string;
  liveUrl?: string;
  githubRepositoryUrl?: string;
  content?: ContentSectionInput[];
  databases?: DatabaseSchemaModelInput[];
  apis?: ApiReferenceModelInput;
  futureImprovements?: TitleDescriptionInput[];
  author?: AuthorInput;
  metadata?: MetadataInput;
  seo?: SEOInput;
  isActive?: boolean;
  performance?: PerformanceInput[];
  testing?: TestingInput[];
  media?: MediaInput;
  folderStructure?: FolderNodeInput[];
  pages?: ProjectPageInput[];
  cicd?: CiCdInput;
  deployment?: DeploymentInput[];
  environmentVariables?: EnvironmentVariableGroupInput[];
}
