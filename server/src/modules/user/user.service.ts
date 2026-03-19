import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { handleError } from 'src/utils/error-handler';
import { ResolvedUserInput } from 'src/interfaces';
import { ImageResolverService } from '../../common/image/image-resolver.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userCollection: Model<User>,
    private readonly imageResolverService: ImageResolverService,
  ) {}

  async createUser(body: ResolvedUserInput) {
    try {
      let profileImageAsset;
      let resumeAsset;

      const profileImageFile = body?.profile_image?.[0];
      const resumeFile = body?.resume?.[0];

      if (profileImageFile) {
        const uploadedProfile =
          await this.imageResolverService.resolveSingleImage(
            {
              file: profileImageFile,
            },
            {
              folder: 'portfolio/users/profile',
              publicId: `profile-${Date.now()}`,
              overwrite: true,
              allowSvg: true,
              maxSizeBytes: 5 * 1024 * 1024,
            },
          );

        profileImageAsset = {
          publicId: uploadedProfile.asset.publicId,
          secureUrl: uploadedProfile.asset.secureUrl,
          width: uploadedProfile.asset.width,
          height: uploadedProfile.asset.height,
          format: uploadedProfile.asset.format,
          resourceType: uploadedProfile.asset.resourceType,
          bytes: uploadedProfile.asset.bytes,
          originalFilename: uploadedProfile.asset.originalFilename,
        };
      }

      if (resumeFile) {
        const uploadedResume = await this.imageResolverService.uploadBuffer(
          resumeFile.buffer,
          {
            folder: 'portfolio/users/resume',
            public_id: `resume-${Date.now()}`,
            overwrite: true,
            resource_type: 'raw',
          },
        );

        resumeAsset = {
          publicId: uploadedResume.public_id,
          secureUrl: uploadedResume.secure_url,
          width: uploadedResume.width,
          height: uploadedResume.height,
          format: uploadedResume.format,
          resourceType: uploadedResume.resource_type,
          bytes: uploadedResume.bytes,
          originalFilename: uploadedResume.original_filename,
        };
      }

      const user = await this.userCollection.create({
        ...body,
        profile_image: profileImageAsset,
        resume: resumeAsset,
        skills: body.skills?.map((skill) => ({
          skill_id: new Types.ObjectId(skill.skill_id),
          yoe: skill.yoe,
          scale: skill.scale,
        })),
      });

      return {
        success: true,
        data: user,
        message: 'User created successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to create user');
    }
  }

  // GET ALL
  async getAllUsers() {
    try {
      const users = await this.userCollection
        .find()
        .populate('skills')
        .sort({ createdAt: -1 });

      return {
        success: true,
        data: users,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch users');
    }
  }

  // GET BY ID
  async getUserById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid user ID');
      }

      const user = await this.userCollection.findById(id).populate('skills');

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        success: true,
        data: user,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch user');
    }
  }

  // UPDATE
  async updateUser(id: string, body: Partial<ResolvedUserInput>) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid user ID');
      }

      const user = await this.userCollection.findById(id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (body.about !== undefined) {
        user.about = body.about;
      }

      if (body.links !== undefined) {
        user.links = body.links as any;
      }

      if (body.skills !== undefined) {
        user.skills = body.skills.map((skill) => ({
          skill_id: new Types.ObjectId(skill.skill_id),
          yoe: skill.yoe,
          scale: skill.scale,
        })) as any;
      }

      const profileImageFile = body?.profile_image?.[0];
      const resumeFile = body?.resume?.[0];

      if (profileImageFile) {
        const oldPublicId = user.profile_image?.publicId;

        const uploadedProfile =
          await this.imageResolverService.resolveSingleImage(
            {
              file: profileImageFile,
            },
            {
              folder: 'portfolio/users/profile',
              publicId: `profile-${Date.now()}`,
              overwrite: true,
              allowSvg: true,
              maxSizeBytes: 5 * 1024 * 1024,
            },
          );

        if (oldPublicId && oldPublicId !== uploadedProfile.asset.publicId) {
          try {
            await this.imageResolverService.destroy(oldPublicId);
          } catch {
            // ignore old asset deletion failure
          }
        }

        user.profile_image = {
          publicId: uploadedProfile.asset.publicId,
          secureUrl: uploadedProfile.asset.secureUrl,
          width: uploadedProfile.asset.width,
          height: uploadedProfile.asset.height,
          format: uploadedProfile.asset.format,
          resourceType: uploadedProfile.asset.resourceType,
          bytes: uploadedProfile.asset.bytes,
          originalFilename: uploadedProfile.asset.originalFilename,
        } as any;
      }

      if (resumeFile) {
        const oldResumePublicId = user.resume?.publicId;

        const uploadedResume = await this.imageResolverService.uploadBuffer(
          resumeFile.buffer,
          {
            folder: 'portfolio/users/resume',
            public_id: `resume-${Date.now()}`,
            overwrite: true,
            resource_type: 'raw',
          },
        );

        if (
          oldResumePublicId &&
          oldResumePublicId !== uploadedResume.public_id
        ) {
          try {
            await this.imageResolverService.destroy(oldResumePublicId);
          } catch {
            // ignore old asset deletion failure
          }
        }

        user.resume = {
          publicId: uploadedResume.public_id,
          secureUrl: uploadedResume.secure_url,
          width: uploadedResume.width,
          height: uploadedResume.height,
          format: uploadedResume.format,
          resourceType: uploadedResume.resource_type,
          bytes: uploadedResume.bytes,
          originalFilename: uploadedResume.original_filename,
        } as any;
      }

      await user.save();

      return {
        success: true,
        data: user,
        message: 'User updated successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to update user');
    }
  }

  // DELETE
  async deleteUser(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid user ID');
      }

      const deleted = await this.userCollection.findByIdAndDelete(id);

      if (!deleted) {
        throw new NotFoundException('User not found');
      }

      return {
        success: true,
        message: 'User deleted successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete user');
    }
  }
}
