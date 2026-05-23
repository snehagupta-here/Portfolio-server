import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  ExperienceAlreadyExistsException,
  ExperienceNotFoundException,
  ExperienceSearchQueryRequiredException,
  ExperienceUserNotFoundException,
  InvalidExperienceIdException,
  InvalidExperienceUserIdException,
} from 'src/exceptions/experience.exceptions';
import {
  CloudinaryImageAsset,
  ResolvedExperienceInput,
  UpdateExperience,
} from 'src/interfaces';
import { Experience, ExperienceDocument } from 'src/schema/experience.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { handleError } from 'src/utils/error-handler';
import { slugify } from 'src/utils/slugify';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Experience.name)
    private readonly experienceCollection: Model<ExperienceDocument>,
    @InjectModel(User.name)
    private readonly userCollection: Model<UserDocument>,
  ) {}

  async createExperience(body: ResolvedExperienceInput) {
    try {
      const userId = await this.resolveValidatedUserId(body.user_id);
      const organizationLogo = this.resolveOrganizationLogo(
        body.organization_name,
        body.organization_logo_url,
      );

      const startDate = new Date(body.start_date);
      const existingExperience = await this.experienceCollection.findOne({
        user_id: userId,
        organization_name: body.organization_name,
        designation: body.designation,
        start_date: startDate,
      });

      if (existingExperience) {
        throw new ExperienceAlreadyExistsException();
      }

      const experience = await this.experienceCollection.create({
        user_id: userId,
        start_date: startDate,
        end_date: body.end_date ? new Date(body.end_date) : null,
        location: body.location,
        designation: body.designation,
        description: body.description,
        responsibilities: body.responsibilities,
        organization_name: body.organization_name,
        organization_logo_url: organizationLogo,
        organization_url: this.normalizeOrganizationUrl(body.organization_url),
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

  async getAllExperiences(userId: string) {
    try {
      const scopedUserId = await this.resolveValidatedUserId(userId);
      const experiences = await this.experienceCollection
        .find({ user_id: scopedUserId })
        .sort({ start_date: -1 });

      return {
        success: true,
        data: experiences,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch experiences');
    }
  }

  async searchExperiences(
    userId: string,
    query: {
      designation?: string;
      organization_name?: string;
    },
  ) {
    try {
      const designation = query.designation?.trim();
      const organizationName = query.organization_name?.trim();
      const scopedUserId = await this.resolveValidatedUserId(userId);

      if (!designation && !organizationName) {
        throw new ExperienceSearchQueryRequiredException();
      }

      const filters: Record<string, unknown> = {
        user_id: scopedUserId,
      };

      if (designation) {
        filters.designation = {
          $regex: this.escapeRegex(designation),
          $options: 'i',
        };
      }

      if (organizationName) {
        filters.organization_name = {
          $regex: this.escapeRegex(organizationName),
          $options: 'i',
        };
      }

      const experiences = await this.experienceCollection
        .find(filters)
        .sort({ start_date: -1 });

      return {
        success: true,
        data: experiences,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to search experiences');
    }
  }

  async getExperienceById(id: string, userId: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidExperienceIdException();
      }

      const scopedUserId = await this.resolveValidatedUserId(userId);
      const experience = await this.experienceCollection.findOne({
        _id: id,
        user_id: scopedUserId,
      });

      if (!experience) {
        throw new ExperienceNotFoundException();
      }

      return {
        success: true,
        data: experience,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch experience');
    }
  }

  async updateExperience(id: string, userId: string, body: UpdateExperience) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidExperienceIdException();
      }

      const scopedUserId = await this.resolveValidatedUserId(userId);
      const experience = await this.experienceCollection.findOne({
        _id: id,
        user_id: scopedUserId,
      });

      if (!experience) {
        throw new ExperienceNotFoundException();
      }
      const nextStartDate =
        body.start_date !== undefined
          ? new Date(body.start_date)
          : experience.start_date;
      const nextOrganizationName =
        body.organization_name ?? experience.organization_name;
      const nextDesignation = body.designation ?? experience.designation;

      await this.ensureExperienceDoesNotExist({
        user_id: scopedUserId,
        organization_name: nextOrganizationName,
        designation: nextDesignation,
        start_date: nextStartDate,
        excludeId: experience._id.toString(),
      });

      if (body.start_date !== undefined) {
        experience.start_date = nextStartDate;
      }

      if (body.end_date !== undefined) {
        experience.end_date = body.end_date ? new Date(body.end_date) : null;
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

      if (body.organization_logo_url !== undefined) {
        experience.organization_logo_url = this.resolveOrganizationLogo(
          experience.organization_name,
          body.organization_logo_url,
        );
      }

      if (body.organization_url !== undefined) {
        experience.organization_url = this.normalizeOrganizationUrl(
          body.organization_url,
        );
      }

      if (!experience.organization_logo_url?.secureUrl) {
        experience.organization_logo_url = this.resolveOrganizationLogo(
          experience.organization_name,
          experience.organization_logo_url,
        );
      }

      if (body.tech_stack !== undefined) {
        experience.tech_stack = body.tech_stack;
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

  async deleteExperience(id: string, userId: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidExperienceIdException();
      }

      const scopedUserId = await this.resolveValidatedUserId(userId);
      const deleted = await this.experienceCollection.findOneAndDelete({
        _id: id,
        user_id: scopedUserId,
      });

      if (!deleted) {
        throw new ExperienceNotFoundException();
      }

      return {
        success: true,
        message: 'Experience deleted successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete experience');
    }
  }

  private async resolveValidatedUserId(
    userId: string,
  ): Promise<Types.ObjectId> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new InvalidExperienceUserIdException();
    }

    const resolvedUserId = new Types.ObjectId(userId);
    await this.ensureUserExists(resolvedUserId);

    return resolvedUserId;
  }

  private async ensureUserExists(userId: Types.ObjectId) {
    const existingUser = await this.userCollection.findById(userId);

    if (!existingUser) {
      throw new ExperienceUserNotFoundException();
    }
  }

  private async ensureExperienceDoesNotExist(input: {
    user_id: Types.ObjectId;
    organization_name: string;
    designation: string;
    start_date: Date;
    excludeId?: string;
  }) {
    const existingExperience = await this.experienceCollection.findOne({
      user_id: input.user_id,
      organization_name: input.organization_name,
      designation: input.designation,
      start_date: input.start_date,
    });

    if (
      existingExperience &&
      existingExperience._id.toString() !== input.excludeId
    ) {
      throw new ExperienceAlreadyExistsException();
    }
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private normalizeOrganizationUrl(url?: string): string {
    return url?.trim() ?? '';
  }

  private resolveOrganizationLogo(
    organizationName: string,
    organizationLogo?: CloudinaryImageAsset,
  ): CloudinaryImageAsset {
    if (organizationLogo?.secureUrl) {
      return organizationLogo;
    }

    const normalizedOrganizationName = organizationName.trim();
    const initials = normalizedOrganizationName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
    const palette = [
      { background: '0F766E', color: 'F8FAFC' },
      { background: '1D4ED8', color: 'F8FAFC' },
      { background: 'B45309', color: 'FFFBEB' },
      { background: '7C3AED', color: 'FAF5FF' },
      { background: 'BE123C', color: 'FFF1F2' },
    ];
    const paletteIndex =
      Array.from(normalizedOrganizationName).reduce(
        (sum, char) => sum + char.charCodeAt(0),
        0,
      ) % palette.length;
    const { background, color } = palette[paletteIndex];
    const slug = slugify(normalizedOrganizationName) || 'organization';
    const query = new URLSearchParams({
      name: initials || 'ORG',
      background,
      color,
      size: '256',
      format: 'svg',
      rounded: 'true',
      bold: 'true',
    });

    return {
      publicId: `generated/experience/${slug}-logo`,
      secureUrl: `https://ui-avatars.com/api/?${query.toString()}`,
      width: 256,
      height: 256,
      format: 'svg',
      resourceType: 'image',
      originalFilename: `${slug}-logo.svg`,
    };
  }
}
