export enum ApiMethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export enum PerformanceStatusEnum {
  ACTIVE = 'active',
  PLANNED = 'planned',
  DEPRECATED = 'deprecated',
}

export enum PerformanceComplexityEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TestingTypeEnum {
  UNIT = 'unit',
  END_TO_END = 'e2e',
  INTEGRATION = 'integration',
}

export enum FolderStructureTypeEnum {
  FOLDER = 'folder',
  FILE = 'file',
}

export enum PageAccessEnum {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum PageRenderingTypeEnum {
  SERVER_SIDE_RENDERING = 'ssr',
  CLIENT_SIDE_RENDERING = 'csr',
  INCREMENT_STATIC_REGENERATION = 'isr',
  STATIC_SITE_GENERATION = 'ssg',
}
