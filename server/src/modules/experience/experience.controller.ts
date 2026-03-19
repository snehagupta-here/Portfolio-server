import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { ExperienceDto } from 'src/dto';
import { ExperienceInputResolverService } from 'src/pipes/resolve-experience.pipe';
import type { ResolvedExperienceInput } from 'src/interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('experience')
export class ExperienceController {
  constructor(
    private readonly experienceService: ExperienceService,
    private readonly experienceInputResolverService: ExperienceInputResolverService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('iconFile', {
      storage: memoryStorage(),
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  async create(
    @Body() body: ExperienceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const input: ResolvedExperienceInput =
      this.experienceInputResolverService.resolveCreate(body, file);
    return await this.experienceService.createExperience(input);
  }

  @Get()
  async findAll() {
    return await this.experienceService.getAllExperiences();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.experienceService.getExperienceById(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('iconFile', {
      storage: memoryStorage(),
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() body: Partial<ExperienceDto>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const input = this.experienceInputResolverService.resolveUpdate(body, file);
    return await this.experienceService.updateExperience(id, input);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.experienceService.deleteExperience(id);
  }
}
