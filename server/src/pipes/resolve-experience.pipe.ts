import { Injectable } from '@nestjs/common';
import { ImageValidationService } from '../common/image/image-validation.service';
import type {
  ResolvedExperienceInput,
} from 'src/interfaces';
import { ExperienceDto } from 'src/dto';

@Injectable()
export class ExperienceInputResolverService {
  constructor(
    private readonly imageValidationService: ImageValidationService,
  ) {}

  resolveCreate(
    body: ExperienceDto,
    file?: Express.Multer.File,
  ): ResolvedExperienceInput {
    this.imageValidationService.validateRequiredImageInput({
      file,
      url: body.organization_logo_url,
    });

    if (file) {
      this.imageValidationService.validateImage(file, {
        allowSvg: true,
        maxSizeBytes: 2 * 1024 * 1024,
      },'company_icon');

   return {
        user_id: body.user_id,
        start_date: body.start_date,
        end_date: body.end_date,
        location: body.location,
        designation: body.designation,
        description: body.description,
        responsibilities: body.responsibilities,
        organization_name: body.organization_name,
        organization_logo_url: {
          sourceType: 'file',
          file,
        },
        organization_url: body.organization_url,
        tech_stack: body.tech_stack,
      };
    }

    this.imageValidationService.validateUrl(body.organization_logo_url!, {
      allowedProtocols: ['https:'],
    });

    return {
      user_id: body.user_id,
      start_date: body.start_date,
      end_date: body.end_date,
      location: body.location,
      designation: body.designation,
      description: body.description,
      responsibilities: body.responsibilities,
      organization_name: body.organization_name,
      organization_logo_url: {
        sourceType: 'url',
        url: body.organization_logo_url!,
      },
      organization_url: body.organization_url,
      tech_stack: body.tech_stack,
    };
  }

  resolveUpdate(
    body: Partial<ExperienceDto>,
    file?: Express.Multer.File,
  ): Partial<ResolvedExperienceInput> {
    this.imageValidationService.validateOptionalImageInput({
      file,
      url: body.organization_logo_url,
    });

    if (!file && !body.organization_logo_url?.trim()) {
       return {
        user_id: body.user_id,
        start_date: body.start_date,
        end_date: body.end_date,
        location: body.location,
        designation: body.designation,
        description: body.description,
        responsibilities: body.responsibilities,
        organization_name: body.organization_name,
        organization_url: body.organization_url,
        tech_stack: body.tech_stack,
      };
    }

    if (file) {
      this.imageValidationService.validateImage(file, {
        allowSvg: true,
        maxSizeBytes: 2 * 1024 * 1024,
      },'company_icon');

     return {
        user_id: body.user_id,
        start_date: body.start_date,
        end_date: body.end_date,
        location: body.location,
        designation: body.designation,
        description: body.description,
        responsibilities: body.responsibilities,
        organization_name: body.organization_name,
        organization_logo_url: {
          sourceType: 'file',
          file,
        },
        organization_url: body.organization_url,
        tech_stack: body.tech_stack,
      };
    }

    this.imageValidationService.validateUrl(body.organization_logo_url!, {
      allowedProtocols: ['https:'],
    });

    return {
      user_id: body.user_id,
      start_date: body.start_date,
      end_date: body.end_date,
      location: body.location,
      designation: body.designation,
      description: body.description,
      responsibilities: body.responsibilities,
      organization_name: body.organization_name,
      organization_logo_url: {
        sourceType: 'url',
        url: body.organization_logo_url!,
      },
      organization_url: body.organization_url,
      tech_stack: body.tech_stack,
    };
  }
}