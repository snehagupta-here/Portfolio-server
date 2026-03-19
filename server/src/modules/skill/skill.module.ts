import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CloudinaryProvider } from '../../common/cloudinary/cloudinary.provider';
import { ImageResolverService } from '../../common/image/image-resolver.service';
import { ImageValidationService } from '../../common/image/image-validation.service';

import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';
import { SkillInputResolverService } from '../../pipes/resolve-skill.pipe';
import { Skill, SkillSchema } from '../../schema/skill.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Skill.name, schema: SkillSchema }]),
  ],
  controllers: [SkillController],
  providers: [
    CloudinaryProvider,
    ImageValidationService,
    ImageResolverService,
    SkillInputResolverService,
    SkillService,
  ],
  exports: [SkillService],
})
export class SkillModule {}