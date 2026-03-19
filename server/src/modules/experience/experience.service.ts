import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Experience } from 'src/schema/experience.schema';
import { handleError } from 'src/utils/error-handler';
import { ResolvedExperienceInput } from 'src/interfaces';
import { ImageResolverService } from '../../common/image/image-resolver.service';
import { slugify } from 'src/utils/slugify';
import { User } from 'src/schema/user.schema';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Experience.name)
    private readonly experienceCollection: Model<Experience>,
      @InjectModel(User.name)
        private readonly userCollection: Model<User>,
        private readonly imageResolverService: ImageResolverService,
  ) {}

  // CREATE
 async createExperience(body: ResolvedExperienceInput) {
  try {
    if (!Types.ObjectId.isValid(body.user_id)) {
      throw new BadRequestException('Invalid user_id');
    }

    const userId = new Types.ObjectId(body.user_id);

    const existingUser = await this.userCollection.findById(userId);

    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    const existingExperience = await this.experienceCollection.findOne({
      user_id: userId,
      organization_name: body.organization_name,
      designation: body.designation,
      start_date: new Date(body.start_date),
    });

    if (existingExperience) {
      throw new BadRequestException('Experience already exists');
    }

    let resolvedLogo;

    if (body.organization_logo_url) {
      resolvedLogo = await this.imageResolverService.resolveSingleImage(
        {
          file: body.organization_logo_url.file,
          url: body.organization_logo_url.url,
        },
        {
          folder: 'portfolio/experiences',
          publicId: `${slugify(body.organization_name)}-${Date.now()}`,
          overwrite: true,
          allowSvg: true,
          maxSizeBytes: 2 * 1024 * 1024,
        },
      );
    }

    const experience = await this.experienceCollection.create({
      user_id: userId,
      start_date: new Date(body.start_date),
      end_date: body.end_date ? new Date(body.end_date) : null,
      location: body.location,
      designation: body.designation,
      description: body.description,
      responsibilities: body.responsibilities,
      organization_name: body.organization_name,
      organization_logo_url: resolvedLogo
        ? {
            publicId: resolvedLogo.asset.publicId,
            secureUrl: resolvedLogo.asset.secureUrl,
            width: resolvedLogo.asset.width,
            height: resolvedLogo.asset.height,
            format: resolvedLogo.asset.format,
            resourceType: resolvedLogo.asset.resourceType,
            bytes: resolvedLogo.asset.bytes,
            originalFilename: resolvedLogo.asset.originalFilename,
          }
        : undefined,
      organization_url: body.organization_url,
      tech_stack: body.tech_stack,
    });

    return {
      success: true,
      data: experience,
      message: 'Experience created successfully.',
    };
  } catch (e: unknown) {
    handleError(e, 'Failed to create experience');
  }
}

  // GET ALL
  async getAllExperiences() {
    try {
      const experiences = await this.experienceCollection
        .find()
        .sort({ start_date: -1 });

      return {
        success: true,
        data: experiences,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch experiences');
    }
  }

  // GET BY ID
  async getExperienceById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid experience ID');
      }

      const experience = await this.experienceCollection.findById(id);

      if (!experience) {
        throw new NotFoundException('Experience not found');
      }

      return {
        success: true,
        data: experience,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch experience');
    }
  }

  // UPDATE
 async updateExperience(id: string, body: Partial<ResolvedExperienceInput>) {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid experience ID');
    }

    const experience = await this.experienceCollection.findById(id);

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    if (body.user_id !== undefined) {
      if (!Types.ObjectId.isValid(body.user_id)) {
        throw new BadRequestException('Invalid user_id');
      }
      experience.user_id = new Types.ObjectId(body.user_id) as any;
    }

    if (body.start_date !== undefined) {
      experience.start_date = new Date(body.start_date) as any;
    }

    if (body.end_date !== undefined) {
      experience.end_date = body.end_date ? (new Date(body.end_date) as any) : null;
    }

    if (body.location !== undefined) {
      experience.location = body.location;
    }

    if (body.designation !== undefined) {
      experience.designation = body.designation;
    }

    if (body.description !== undefined) {
      experience.description = body.description;
    }

    if (body.responsibilities !== undefined) {
      experience.responsibilities = body.responsibilities;
    }

    if (body.organization_name !== undefined) {
      experience.organization_name = body.organization_name;
    }

    if (body.organization_url !== undefined) {
      experience.organization_url = body.organization_url;
    }

    if (body.tech_stack !== undefined) {
      experience.tech_stack = body.tech_stack;
    }

    if (body.organization_logo_url) {
      const oldPublicId = experience.organization_logo_url?.publicId;

      const resolved = await this.imageResolverService.resolveSingleImage(
        {
          file: body.organization_logo_url.file,
          url: body.organization_logo_url.url,
        },
        {
          folder: 'portfolio/experiences',
          publicId: `${slugify(
            body.organization_name ?? experience.organization_name,
          )}-${Date.now()}`,
          overwrite: true,
          allowSvg: true,
          maxSizeBytes: 2 * 1024 * 1024,
        },
      );

      if (oldPublicId && oldPublicId !== resolved.asset.publicId) {
        try {
          await this.imageResolverService.destroy(oldPublicId);
        } catch {
          // ignore old asset deletion failure
        }
      }

      experience.organization_logo_url = {
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

    await experience.save();

    return {
      success: true,
      data: experience,
      message: 'Experience updated successfully.',
    };
  } catch (e: unknown) {
    handleError(e, 'Failed to update experience');
  }
}

  // DELETE
  async deleteExperience(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid experience ID');
      }

      const deleted = await this.experienceCollection.findByIdAndDelete(id);

      if (!deleted) {
        throw new NotFoundException('Experience not found');
      }

      return {
        success: true,
        message: 'Experience deleted successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete experience');
    }
  }
}
