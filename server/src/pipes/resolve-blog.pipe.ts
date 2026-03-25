import { Injectable } from '@nestjs/common';
import { CreateBlogDto, UpdateBlogDto } from 'src/dto/blog.dto';
import type {
  ResolvedBlogInput,
  ResolvedBlogUpdateInput,
} from 'src/interfaces/blog.interface';
import { ComplexFuntionResolverService } from 'src/utils/helper-function';
@Injectable()
export class BlogInputResolverService {
  constructor(
    private readonly complexFunctionResolverService: ComplexFuntionResolverService
  ) {}

  resolveCreate(
    body: CreateBlogDto,
    files: Express.Multer.File[] = [],
  ): ResolvedBlogInput {
    const fileMap = this.complexFunctionResolverService.buildFileMap(files);

    return {
      user_id: body.user_id,
      title: body.title,
      slug: body.slug,
      description: body.description,
      content: this.complexFunctionResolverService.resolveContent(body.content, fileMap),
      media: this.complexFunctionResolverService.resolveMedia(body.media, fileMap),
      author: this.complexFunctionResolverService.resolveAuthor(body.author, fileMap),
      metadata: body.metadata,
      seo: body.seo,
      isActive: body.isActive,
    };
  }

  resolveUpdate(
    body: UpdateBlogDto,
    files: Express.Multer.File[] = [],
  ): ResolvedBlogUpdateInput {
    const fileMap = this.complexFunctionResolverService.buildFileMap(files);

    return {
      title: body.title,
      slug: body.slug,
      description: body.description,
      content: this.complexFunctionResolverService.resolveContent(body.content, fileMap),
      media: this.complexFunctionResolverService.resolveMedia(body.media, fileMap),
      author: this.complexFunctionResolverService.resolveAuthor(body.author, fileMap),
      metadata: body.metadata,
      seo: body.seo,
      isActive: body.isActive,
    };
  }
}
