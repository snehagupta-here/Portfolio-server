import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from 'src/schema/project.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { ImageResolverService } from 'src/common/image/image-resolver.service';
import type {
  ResolvedProjectInput,
  ResolvedProjectUpdateInput,
} from 'src/interfaces';
import { handleError } from 'src/utils/error-handler';
import { slugify } from 'src/utils/slugify';
import { ComplexFuntionResolverService } from 'src/utils/helper-function';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectCollection: Model<ProjectDocument>,

    @InjectModel(User.name)
    private readonly userCollection: Model<UserDocument>,
    private readonly complexFunctionResolverService: ComplexFuntionResolverService,
    private readonly imageResolverService: ImageResolverService,
  ) {}

  async createProject(body: ResolvedProjectInput) {
    try {
      if (!Types.ObjectId.isValid(body.user_id)) {
        throw new BadRequestException('Invalid user_id');
      }

      const userId = new Types.ObjectId(body.user_id);

      const existingUser = await this.userCollection.findById(userId);
      if (!existingUser) {
        throw new BadRequestException('User not found');
      }

      const existingProject = await this.projectCollection.findOne({
        $or: [{ slug: body.slug }, { title: body.title }],
      });

      if (existingProject) {
        throw new BadRequestException('Project already exists');
      }

      const resolvedMedia = body.media
        ? {
            type: body.media.type,
            thumbnail: body.media.thumbnail
              ? await this.complexFunctionResolverService.uploadSingleAsset(
                  body.media.thumbnail,
                  'portfolio/projects/media',
                  `${slugify(body.slug)}-thumbnail-${Date.now()}`,
                  'media-thumbnail',
                )
              : undefined,
            banner: body.media.banner
              ? await this.complexFunctionResolverService.uploadSingleAsset(
                  body.media.banner,
                  'portfolio/projects/media',
                  `${slugify(body.slug)}-banner-${Date.now()}`,
                  'media-banner',
                )
              : undefined,
          }
        : undefined;

      const resolvedAuthor = body.author
        ? {
            name: body.author.name,
            linkedin: body.author.linkedin,
            github: body.author.github,
            avatar: body.author.avatar
              ? await this.complexFunctionResolverService.uploadSingleAsset(
                  body.author.avatar,
                  'portfolio/projects/authors',
                  `${slugify(body.slug)}-author-${Date.now()}`,
                  'author-avatar',
                )
              : undefined,
          }
        : undefined;

      const resolvedContent = body.content
        ? await this.complexFunctionResolverService.resolveContentSectionForUploadingImage(
            body.content,
            body.slug,
            'projects',
          )
        : [];

      const project = await this.projectCollection.create({
        user_id: userId,
        title: body.title,
        slug: body.slug,
        tagline: body.tagline,
        description: body.description,
        github: body.github,
        liveUrl: body.liveUrl,
        githubRepositoryUrl: body.githubRepositoryUrl,
        content: resolvedContent,
        databases: body.databases ?? [],
        apis: body.apis,
        futureImprovements: body.futureImprovements ?? [],
        media: resolvedMedia,
        author: resolvedAuthor,
        metadata: body.metadata
          ? {
              ...body.metadata,
              publishedDate: body.metadata.publishedDate
                ? new Date(body.metadata.publishedDate)
                : undefined,
              lastModified: body.metadata.lastModified
                ? new Date(body.metadata.lastModified)
                : undefined,
            }
          : undefined,
        seo: body.seo,
        isActive: body.isActive,
        performance: body.performance ?? [],
        testing: body.testing ?? [],
        folderStructure: body.folderStructure ?? [],
        pages: body.pages ?? [],
        cicd: body.cicd,
        deployment: body.deployment ?? [],
        environmentVariables: body.environmentVariables ?? [],
      });

      return {
        success: true,
        data: project,
        message: 'Project created successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to create project');
    }
  }

  async updateProject(id: string, body: ResolvedProjectUpdateInput) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid project id');
      }

      const project = await this.projectCollection.findById(id);

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (body.user_id !== undefined) {
        if (!Types.ObjectId.isValid(body.user_id)) {
          throw new BadRequestException('Invalid user_id');
        }

        const existingUser = await this.userCollection.findById(body.user_id);
        if (!existingUser) {
          throw new BadRequestException('User not found');
        }

        project.user_id = new Types.ObjectId(body.user_id) as any;
      }

      if (body.title !== undefined) {
        const duplicateTitle = await this.projectCollection.findOne({
          title: body.title,
          _id: { $ne: id },
        });

        if (duplicateTitle) {
          throw new BadRequestException('Project title already exists');
        }

        project.title = body.title;
      }

      if (body.slug !== undefined) {
        const duplicateSlug = await this.projectCollection.findOne({
          slug: body.slug,
          _id: { $ne: id },
        });

        if (duplicateSlug) {
          throw new BadRequestException('Project slug already exists');
        }

        project.slug = body.slug;
      }

      if (body.tagline !== undefined) {
        project.tagline = body.tagline;
      }

      if (body.description !== undefined) {
        project.description = body.description;
      }

      if (body.github !== undefined) {
        project.github = body.github;
      }

      if (body.liveUrl !== undefined) {
        project.liveUrl = body.liveUrl;
      }

      if (body.githubRepositoryUrl !== undefined) {
        project.githubRepositoryUrl = body.githubRepositoryUrl;
      }

      if (body.isActive !== undefined) {
        project.isActive = body.isActive;
      }

      if (body.media) {
        const oldThumbnailPublicId = project.media?.thumbnail?.publicId;
        const oldBannerPublicId = project.media?.banner?.publicId;

        const resolvedThumbnail = body.media.thumbnail
          ? await this.complexFunctionResolverService.uploadSingleAsset(
              body.media.thumbnail,
              'portfolio/projects/media',
              `${slugify(body.slug ?? project.slug)}-thumbnail-${Date.now()}`,
              'media-thumbnail',
            )
          : undefined;

        const resolvedBanner = body.media.banner
          ? await this.complexFunctionResolverService.uploadSingleAsset(
              body.media.banner,
              'portfolio/projects/media',
              `${slugify(body.slug ?? project.slug)}-banner-${Date.now()}`,
              'media-banner',
            )
          : undefined;

        if (
          oldThumbnailPublicId &&
          resolvedThumbnail?.publicId &&
          oldThumbnailPublicId !== resolvedThumbnail.publicId
        ) {
          try {
            await this.imageResolverService.destroy(oldThumbnailPublicId);
          } catch {
            // ignore delete failure
          }
        }

        if (
          oldBannerPublicId &&
          resolvedBanner?.publicId &&
          oldBannerPublicId !== resolvedBanner.publicId
        ) {
          try {
            await this.imageResolverService.destroy(oldBannerPublicId);
          } catch {
            // ignore delete failure
          }
        }

        project.media = {
          type: body.media.type ?? project.media?.type,
          thumbnail: resolvedThumbnail ?? project.media?.thumbnail,
          banner: resolvedBanner ?? project.media?.banner,
        } as any;
      }

      if (body.author) {
        const oldAvatarPublicId = project.author?.avatar?.publicId;

        const resolvedAvatar = body.author.avatar
          ? await this.complexFunctionResolverService.uploadSingleAsset(
              body.author.avatar,
              'portfolio/projects/authors',
              `${slugify(body.slug ?? project.slug)}-author-${Date.now()}`,
              'author-avatar',
            )
          : undefined;

        if (
          oldAvatarPublicId &&
          resolvedAvatar?.publicId &&
          oldAvatarPublicId !== resolvedAvatar.publicId
        ) {
          try {
            await this.imageResolverService.destroy(oldAvatarPublicId);
          } catch {
            // ignore delete failure
          }
        }

        project.author = {
          name: body.author.name ?? project.author?.name,
          linkedin: body.author.linkedin ?? project.author?.linkedin,
          github: body.author.github ?? project.author?.github,
          avatar: resolvedAvatar ?? project.author?.avatar,
        } as any;
      }

      if (body.content !== undefined) {
        project.content =
          (await this.complexFunctionResolverService.resolveContentSectionForUploadingImage(
            body.content,
            body.slug ?? project.slug,
            'projects',
          )) as any;
      }

      if (body.databases !== undefined) {
        project.databases = body.databases as any;
      }

      if (body.apis !== undefined) {
        project.apis = body.apis as any;
      }

      if (body.futureImprovements !== undefined) {
        project.futureImprovements = body.futureImprovements as any;
      }

      if (body.metadata !== undefined) {
        project.metadata = {
          ...project.metadata,
          ...body.metadata,
          publishedDate: body.metadata.publishedDate
            ? new Date(body.metadata.publishedDate)
            : project.metadata?.publishedDate,
          lastModified: body.metadata.lastModified
            ? new Date(body.metadata.lastModified)
            : project.metadata?.lastModified,
        } as any;
      }

      if (body.seo !== undefined) {
        project.seo = {
          ...project.seo,
          ...body.seo,
        } as any;
      }

      if (body.performance !== undefined) {
        project.performance = body.performance as any;
      }

      if (body.testing !== undefined) {
        project.testing = body.testing as any;
      }

      if (body.folderStructure !== undefined) {
        project.folderStructure = body.folderStructure as any;
      }

      if (body.pages !== undefined) {
        project.pages = body.pages as any;
      }

      if (body.cicd !== undefined) {
        project.cicd = body.cicd as any;
      }

      if (body.deployment !== undefined) {
        project.deployment = body.deployment as any;
      }

      if (body.environmentVariables !== undefined) {
        project.environmentVariables = body.environmentVariables as any;
      }

      await project.save();

      return {
        success: true,
        data: project,
        message: 'Project updated successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to update project');
    }
  }

  async getAllProjects() {
    try {
      const projects = await this.projectCollection
        .find({ isActive: true })
        .sort({ createdAt: -1 });

      return {
        success: true,
        data: projects,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch projects');
    }
  }

  async getProjectById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid project id');
      }

      const project = await this.projectCollection.findById(id);

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      return {
        success: true,
        data: project,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch project');
    }
  }

  async deleteProject(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid project id');
      }

      const deleted = await this.projectCollection.findById(id);

      if (!deleted) {
        throw new NotFoundException('Project not found');
      }

      const mediaPublicIds = [
        deleted.media?.thumbnail?.publicId,
        deleted.media?.banner?.publicId,
        deleted.author?.avatar?.publicId,
      ].filter(Boolean) as string[];

      if (mediaPublicIds.length) {
        await Promise.allSettled(
          mediaPublicIds.map((publicId) =>
            this.imageResolverService.destroy(publicId),
          ),
        );
      }

      await this.projectCollection.findByIdAndDelete(id);

      return {
        success: true,
        message: 'Project deleted successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete project');
    }
  }
}
