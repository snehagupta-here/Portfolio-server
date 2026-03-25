import { Injectable } from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from 'src/dto/project.dto';
import type {
  ResolvedProjectInput,
  ResolvedProjectUpdateInput,
} from 'src/interfaces/project.interface';
import { ComplexFuntionResolverService } from 'src/utils/helper-function';

@Injectable()
export class ProjectInputResolverService {
  constructor(
    private readonly complexFunctionResolverService: ComplexFuntionResolverService,
  ) {}

  resolveCreate(
    body: CreateProjectDto,
    files: Express.Multer.File[] = [],
  ): ResolvedProjectInput {
    const fileMap = this.complexFunctionResolverService.buildFileMap(files);

    return {
      user_id: body.user_id,
      title: body.title,
      slug: body.slug,
      tagline: body.tagline,
      description: body.description,
      github: body.github,
      liveUrl: body.liveUrl,
      githubRepositoryUrl: body.githubRepositoryUrl,
      content: this.complexFunctionResolverService.resolveContent(
        body.content,
        fileMap,
      ),
      databases: body.databases,
      apis: body.apis,
      futureImprovements: body.futureImprovements,
      media: this.complexFunctionResolverService.resolveMedia(body.media, fileMap),
      author: this.complexFunctionResolverService.resolveAuthor(
        body.author,
        fileMap,
      ),
      metadata: body.metadata,
      seo: body.seo,
      isActive: body.isActive,
      performance: body.performance,
      testing: body.testing,
      folderStructure: body.folderStructure,
      pages: body.pages,
      cicd: body.cicd,
      deployment: body.deployment,
      environmentVariables: body.environmentVariables,
    };
  }

  resolveUpdate(
    body: UpdateProjectDto,
    files: Express.Multer.File[] = [],
  ): ResolvedProjectUpdateInput {
    const fileMap = this.complexFunctionResolverService.buildFileMap(files);

    return {
      title: body.title,
      slug: body.slug,
      tagline: body.tagline,
      description: body.description,
      github: body.github,
      liveUrl: body.liveUrl,
      githubRepositoryUrl: body.githubRepositoryUrl,
      content: this.complexFunctionResolverService.resolveContent(
        body.content,
        fileMap,
      ),
      databases: body.databases,
      apis: body.apis,
      futureImprovements: body.futureImprovements,
      media: this.complexFunctionResolverService.resolveMedia(body.media, fileMap),
      author: this.complexFunctionResolverService.resolveAuthor(
        body.author,
        fileMap,
      ),
      metadata: body.metadata,
      seo: body.seo,
      isActive: body.isActive,
      performance: body.performance,
      testing: body.testing,
      folderStructure: body.folderStructure,
      pages: body.pages,
      cicd: body.cicd,
      deployment: body.deployment,
      environmentVariables: body.environmentVariables,
    };
  }
}