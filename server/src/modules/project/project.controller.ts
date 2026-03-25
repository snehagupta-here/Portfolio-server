import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ResolvedProjectInput,
  ResolvedProjectUpdateInput,
} from 'src/interfaces';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from 'src/dto/project.dto';
import { ProjectInputResolverService } from 'src/pipes/resolve-project.pipe';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectInputResolverService: ProjectInputResolverService,
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
    @Body() body: CreateProjectDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const input: ResolvedProjectInput =
      this.projectInputResolverService.resolveCreate(body, files);

    return this.projectService.createProject(input);
  }

  @Get()
  async getAllProjects() {
    console.log("hey hye")
    return this.projectService.getAllProjects();
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string) {
    return this.projectService.getProjectById(id);
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
    @Body() body: UpdateProjectDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const input: ResolvedProjectUpdateInput =
      this.projectInputResolverService.resolveUpdate(body, files);

    return this.projectService.updateProject(id, input);
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }
}
