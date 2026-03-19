import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Skill } from 'src/schema/skill.schema';
import { handleError } from 'src/utils/error-handler';
import { ImageResolverService } from '../../common/image/image-resolver.service';
import type { ResolvedSkillInput } from 'src/interfaces';
import { slugify } from 'src/utils/slugify';

@Injectable()
export class SkillService {
  constructor(
    @InjectModel(Skill.name)
    private readonly skillCollection: Model<Skill>,
    private readonly imageResolverService: ImageResolverService,
  ) {}

  // CREATE
  async createSkill(body: ResolvedSkillInput) {
    try {
      // Check if skill already exists for the user
      const existingSkill = await this.skillCollection.findOne({
        name: body.name,
      });

      if (existingSkill) {
        throw new BadRequestException('Skill already exists');
      }
      const resolved = await this.imageResolverService.resolveSingleImage(
        {
          file: body.icon.file,
          url: body.icon.url,
        },
        {
          folder: 'portfolio/skills',
          publicId: `skills/${slugify(body.name)}-${Date.now()}`,
          overwrite: true,
          allowSvg: true,
          maxSizeBytes: 2 * 1024 * 1024,
        },
      );

      const skill = await this.skillCollection.create({
        name: body.name,
        category: body.category,
        icon: {
          publicId: resolved.asset.publicId,
          secureUrl: resolved.asset.secureUrl,
          width: resolved.asset.width,
          height: resolved.asset.height,
          format: resolved.asset.format,
          resourceType: resolved.asset.resourceType,
          bytes: resolved.asset.bytes,
          originalFilename: resolved.asset.originalFilename,
        },
      });

      return {
        success: true,
        data: skill,
        message: 'Skill created successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to create skill');
    }
  }

  // GET ALL
  async getAllSkills() {
    try {
      const skills = await this.skillCollection.find().sort({ createdAt: -1 });

      return {
        success: true,
        data: skills,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch skills');
    }
  }

  // GET BY ID
  async getSkillById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid skill ID');
      }

      const skill = await this.skillCollection.findById(id);

      if (!skill) {
        throw new NotFoundException('Skill not found');
      }

      return {
        success: true,
        data: skill,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch skill');
    }
  }

  // UPDATE
  async updateSkill(id: string, body: Partial<ResolvedSkillInput>) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid skill ID');
      }

      const skill = await this.skillCollection.findById(id);

      if (!skill) {
        throw new NotFoundException('Skill not found');
      }
      if (body.name !== undefined) {
        skill.name = body.name;
      }

      if (body.category !== undefined) {
        skill.category = body.category;
      }
      if (body.icon) {
        const resolved = await this.imageResolverService.resolveSingleImage(
          {
            file: body.icon.file,
            url: body.icon.url,
          },
          {
            folder: 'portfolio/skills',
            publicId: `skills/${slugify(body.name ?? skill.name)}-${Date.now()}`,
            overwrite: true,
            allowSvg: true,
            maxSizeBytes: 2 * 1024 * 1024,
          },
        );

        if (skill.icon?.publicId) {
          try {
            await this.imageResolverService.destroy(skill.icon.publicId);
          } catch {
            // ignore old asset deletion failure
          }
        }

        skill.icon = {
          publicId: resolved.asset.publicId,
          secureUrl: resolved.asset.secureUrl,
          width: resolved.asset.width,
          height: resolved.asset.height,
          format: resolved.asset.format,
          resourceType: resolved.asset.resourceType,
          bytes: resolved.asset.bytes,
          originalFilename: resolved.asset.originalFilename,
        } as any;
      }
      await skill.save();
      return {
        success: true,
        data: skill,
        message: 'Skill updated successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to update skill');
    }
  }

  // DELETE
  async deleteSkill(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid skill ID');
      }

      const deleted = await this.skillCollection.findByIdAndDelete(id);

      if (!deleted) {
        throw new NotFoundException('Skill not found');
      }

      return {
        success: true,
        message: 'Skill deleted successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete skill');
    }
  }
}
