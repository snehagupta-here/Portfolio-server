import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Blog, BlogDocument } from 'src/schema/blog.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { ImageResolverService } from 'src/common/image/image-resolver.service';
import type {
  ResolvedBlogInput,
  ResolvedBlogUpdateInput,
} from 'src/interfaces';
import { ContentSectionInput } from 'src/interfaces';
import { handleError } from 'src/utils/error-handler';
import { slugify } from 'src/utils/slugify';
import { ComplexFuntionResolverService } from 'src/utils/helper-function';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogCollection: Model<BlogDocument>,

    @InjectModel(User.name)
    private readonly userCollection: Model<UserDocument>,
    private readonly complexFunctionResolverService: ComplexFuntionResolverService,
    private readonly imageResolverService: ImageResolverService,
  ) {}

  async createBlog(body: ResolvedBlogInput) {
    try {
      console.log('the body is', body);
      if (!Types.ObjectId.isValid(body.user_id)) {
        throw new BadRequestException('Invalid user_id');
      }

      const userId = new Types.ObjectId(body.user_id);

      const existingUser = await this.userCollection.findById(userId);
      if (!existingUser) {
        throw new BadRequestException('User not found');
      }

      const existingBlog = await this.blogCollection.findOne({
        $or: [{ slug: body.slug }, { title: body.title }],
      });

      if (existingBlog) {
        throw new BadRequestException('Blog already exists');
      }

      const resolvedMedia = body.media
        ? {
            type: body.media.type,
            thumbnail: body.media.thumbnail
              ? await this.complexFunctionResolverService.uploadSingleAsset(
                  body.media.thumbnail,
                  'portfolio/blogs/media',
                  `${slugify(body.slug)}-thumbnail-${Date.now()}`,
                  'media-thumbnail',
                )
              : undefined,
          }
        : undefined;

      const resolvedAuthor = body.author
        ? {
            name: body.author.name,
            avatar: body.author.avatar
              ? await this.complexFunctionResolverService.uploadSingleAsset(
                  body.author.avatar,
                  'portfolio/blogs/authors',
                  `${slugify(body.slug)}-author-${Date.now()}`,
                  'author-avatar',
                )
              : undefined,
          }
        : undefined;

      const resolvedContent = body.content
        ? await this.complexFunctionResolverService.resolveContentSectionForUploadingImage(body.content, body.slug,'blogs')
        : [];

      const blog = await this.blogCollection.create({
        user_id: userId,
        title: body.title,
        slug: body.slug,
        description: body.description,
        content: resolvedContent,
        media: resolvedMedia,
        author: resolvedAuthor,
        metadata: body.metadata
          ? {
              publishedDate: body.metadata.publishedDate
                ? new Date(body.metadata.publishedDate)
                : undefined,
              lastModified: body.metadata.lastModified
                ? new Date(body.metadata.lastModified)
                : undefined,
              featured: body.metadata.featured,
              readTime: body.metadata.readTime,
            }
          : undefined,
        seo: body.seo,
        isActive: body.isActive,
      });

      return {
        success: true,
        data: blog,
        message: 'Blog created successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to create blog');
    }
  }

  async updateBlog(id: string, body: ResolvedBlogUpdateInput) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid blog ID');
      }

      const blog = await this.blogCollection.findById(id);

      if (!blog) {
        throw new NotFoundException('Blog not found');
      }

      if (body.user_id !== undefined) {
        if (!Types.ObjectId.isValid(body.user_id)) {
          throw new BadRequestException('Invalid user_id');
        }

        const existingUser = await this.userCollection.findById(body.user_id);
        if (!existingUser) {
          throw new BadRequestException('User not found');
        }

        blog.user_id = new Types.ObjectId(body.user_id) as any;
      }

      if (body.title !== undefined) {
        blog.title = body.title;
      }

      if (body.slug !== undefined) {
        const duplicateSlug = await this.blogCollection.findOne({
          slug: body.slug,
          _id: { $ne: id },
        });

        if (duplicateSlug) {
          throw new BadRequestException('Blog slug already exists');
        }

        blog.slug = body.slug;
      }

      if (body.description !== undefined) {
        blog.description = body.description;
      }

      if (body.isActive !== undefined) {
        blog.isActive = body.isActive;
      }

      if (body.media) {
        const oldPublicId = blog.media?.thumbnail?.publicId;

        const resolvedThumbnail = body.media.thumbnail
          ? await this.complexFunctionResolverService.uploadSingleAsset(
              body.media.thumbnail,
              'portfolio/blogs/media',
              `${slugify(body.slug ?? blog.slug)}-thumbnail-${Date.now()}`,
              'media-thumbnail',
            )
          : undefined;

        if (
          oldPublicId &&
          resolvedThumbnail?.publicId &&
          oldPublicId !== resolvedThumbnail.publicId
        ) {
          try {
            await this.imageResolverService.destroy(oldPublicId);
          } catch {
            // ignore delete failure
          }
        }

        blog.media = {
          type: body.media.type ?? blog.media?.type,
          thumbnail: resolvedThumbnail ?? blog.media?.thumbnail,
        } as any;
      }

      if (body.author) {
        const oldAvatarPublicId = blog.author?.avatar?.publicId;

        const resolvedAvatar = body.author.avatar
          ? await this.complexFunctionResolverService.uploadSingleAsset(
              body.author.avatar,
              'portfolio/blogs/authors',
              `${slugify(body.slug ?? blog.slug)}-author-${Date.now()}`,
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

        blog.author = {
          name: body.author.name ?? blog.author?.name,
          avatar: resolvedAvatar ?? blog.author?.avatar,
        } as any;
      }

      if (body.content !== undefined) {
        blog.content = (await this.complexFunctionResolverService.resolveContentSectionForUploadingImage(
          body.content,
          body.slug ?? blog.slug,
          'blogs'
        )) as any;
      }

      if (body.metadata !== undefined) {
        blog.metadata = {
          ...blog.metadata,
          ...body.metadata,
          publishedDate: body.metadata.publishedDate
            ? new Date(body.metadata.publishedDate)
            : blog.metadata?.publishedDate,
          lastModified: body.metadata.lastModified
            ? new Date(body.metadata.lastModified)
            : blog.metadata?.lastModified,
        } as any;
      }

      if (body.seo !== undefined) {
        blog.seo = {
          ...blog.seo,
          ...body.seo,
        } as any;
      }

      await blog.save();

      return {
        success: true,
        data: blog,
        message: 'Blog updated successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to update blog');
    }
  }

  // GET ALL
  async getAllBlogs() {
    try {
      const blogs = await this.blogCollection.find().sort({ createdAt: -1 });

      return {
        success: true,
        data: blogs,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch blogs');
    }
  }

  // GET BY ID
  async getBlogById(id: string) {
    try {
      const blog = await this.blogCollection.findById(id);

      if (!blog) {
        throw new NotFoundException('Blog not found');
      }

      return {
        success: true,
        data: blog,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch blog');
    }
  }

  // DELETE
  async deleteBlog(id: string) {
    try {
      const deleted = await this.blogCollection.findByIdAndDelete(id);

      if (!deleted) {
        throw new NotFoundException('Blog not found');
      }

      return {
        success: true,
        message: 'Blog deleted successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete blog');
    }
  }
}
