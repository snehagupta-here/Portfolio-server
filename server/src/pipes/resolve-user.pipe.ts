import { Injectable, BadRequestException } from '@nestjs/common';
import { ImageValidationService } from '../common/image/image-validation.service';
import type { ResolvedUserInput } from 'src/interfaces';
import { UserDto } from 'src/dto';

@Injectable()
export class UserInputResolverService {
  constructor(
    private readonly imageValidationService: ImageValidationService,
  ) {}

  resolveCreate(
    body: UserDto,
    files: {
      profile_image?: Express.Multer.File[];
      resume?: Express.Multer.File[];
    },
  ): ResolvedUserInput {
    if (files?.profile_image) {
      this.imageValidationService.validateImage(
        files.profile_image[0],
        {
          allowSvg: true,
          maxSizeBytes: 2 * 1024 * 1024,
        },
        'profile_image',
      );
    }

    if (files?.resume) {
      console.log('resume file =>', {
        originalname: files.resume[0].originalname,
        mimetype: files.resume[0].mimetype,
        size: files.resume[0].size,
      });
      this.imageValidationService.validateFile(
        files.resume[0],
        {
          allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/octet-stream',
            'application/zip',
          ],
          allowedExtensions: ['pdf', 'doc', 'docx'],
          maxSizeBytes: 5 * 1024 * 1024,
        },
        'resume',
      );
    }

    return {
      name: body.name,
      about: body.about,
      links: body.links,
      skills: body.skills,
      ...files,
    };
  }

  resolveUpdate(
    body: Partial<UserDto>,
    files: {
      profile_image?: Express.Multer.File[];
      resume?: Express.Multer.File[];
    },
  ): Partial<ResolvedUserInput> {
    if ((body as any).resume !== undefined) {
      throw new BadRequestException(
        'Resume URL is not supported. Please upload the resume file instead.',
      );
    }

    if ((body as any).profile_image !== undefined) {
      throw new BadRequestException(
        'Profile image URL is not supported. Please upload the image file instead.',
      );
    }

    if (files?.profile_image) {
      this.imageValidationService.validateImage(
        files.profile_image[0],
        {
          allowSvg: true,
          maxSizeBytes: 2 * 1024 * 1024,
        },
        'profile_image',
      );
    }

    if (files?.resume) {
      console.log('resume file =>', {
        originalname: files.resume[0].originalname,
        mimetype: files.resume[0].mimetype,
        size: files.resume[0].size,
      });
      this.imageValidationService.validateFile(
        files.resume[0],
        {
          allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/octet-stream',
            'application/zip',
          ],
          allowedExtensions: ['pdf', 'doc', 'docx'],
          maxSizeBytes: 5 * 1024 * 1024,
        },
        'resume',
      );
    }

    return {
      ...body,
      ...files,
    };
  }
}
