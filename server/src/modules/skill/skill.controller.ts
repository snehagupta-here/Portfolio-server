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
import { SkillService } from './skill.service';
import { SkillDto } from 'src/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { SkillInputResolverService } from '../../pipes/resolve-skill.pipe';
import type { ResolvedSkillInput } from 'src/interfaces';

@Controller('skills')
export class SkillController {
  constructor(
    private readonly skillService: SkillService,
    private readonly skillInputResolverService: SkillInputResolverService,
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
    @Body() body: SkillDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const input: ResolvedSkillInput =
      this.skillInputResolverService.resolveCreate(body, file);

    return await this.skillService.createSkill(input);
  }

  @Get()
  async findAll() {
    return await this.skillService.getAllSkills();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.skillService.getSkillById(id);
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
    @Body() body: Partial<SkillDto>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const input = this.skillInputResolverService.resolveUpdate(body, file);
    return await this.skillService.updateSkill(id, input);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.skillService.deleteSkill(id);
  }
}
