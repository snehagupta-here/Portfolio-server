import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from 'src/dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { BlogInputResolverService } from 'src/pipes/resolve-blog.pipe';
import { ResolvedBlogInput, ResolvedBlogUpdateInput } from 'src/interfaces';

@Controller('blog')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly blogInputResolverService: BlogInputResolverService,
  ) {}

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async create(
    @Body() body: CreateBlogDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const input: ResolvedBlogInput =
      this.blogInputResolverService.resolveCreate(body, files);

    return this.blogService.createBlog(input);
  }

  @Get()
  async findAll() {
    return await this.blogService.getAllBlogs();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.blogService.getBlogById(id);
  }

  @Patch(':id')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() body: UpdateBlogDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const input: ResolvedBlogUpdateInput =
      this.blogInputResolverService.resolveUpdate(body, files);

    return this.blogService.updateBlog(id, input);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.blogService.deleteBlog(id);
  }
}
