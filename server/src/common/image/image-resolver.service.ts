import { Inject, Injectable } from '@nestjs/common';
import {
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import * as streamifier from 'streamifier';
import { BadRequestException } from '@nestjs/common';
import {
  CloudinaryImageAsset,
  ResolveImageInput,
  ResolveImageOptions,
  ResolvedImageResult,
} from './image.types';
import { ImageValidationService } from './image-validation.service';

@Injectable()
export class ImageResolverService {
  constructor(
    private readonly imageValidationService: ImageValidationService,
    @Inject('CLOUDINARY')
    private readonly cloudinaryClient: typeof cloudinary,
  ) {}

  async resolveSingleImage(
    input: ResolveImageInput,
    options: ResolveImageOptions,
    fieldName?: string,
  ): Promise<ResolvedImageResult> {
    this.imageValidationService.validateRequiredImageInput(input);

    if (input.file) {
      const raw = await this.uploadBuffer(
        input.file.buffer,
        {
          folder: options.folder,
          public_id: options.publicId,
          overwrite: options.overwrite ?? true,
          resource_type: 'image',
        },
        fieldName,
      );

      return {
        sourceType: 'file',
        asset: this.toAsset(raw),
        raw,
      };
    }

    await this.assertRemoteImageReachable(input.url!, fieldName);

    const raw = await this.uploadRemoteUrl(
      input.url!,
      {
        folder: options.folder,
        public_id: options.publicId,
        overwrite: options.overwrite ?? true,
        resource_type: 'image',
      },
      fieldName,
    );

    return {
      sourceType: 'url',
      asset: this.toAsset(raw),
      raw,
    };
  }

  async uploadBuffer(
    buffer: Buffer,
    options: UploadApiOptions = {},
    fieldName?: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinaryClient.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(
              new Error('Cloudinary upload failed for ' + `${fieldName}`),
            );
          resolve(result);
        },
      );

      streamifier.createReadStream(buffer).pipe(stream);
    });
  }

  async uploadRemoteUrl(
    fileUrl: string,
    options: UploadApiOptions = {},
    fieldName = 'file',
  ): Promise<UploadApiResponse> {
    try {
      return await this.cloudinaryClient.uploader.upload(fileUrl, options);
    } catch (error: any) {
      throw new BadRequestException(
        `${fieldName}: ${error?.message || 'Remote upload failed'}`,
      );
    }
  }

  async destroy(publicId: string) {
    return this.cloudinaryClient.uploader.destroy(publicId);
  }

  private toAsset(raw: UploadApiResponse): CloudinaryImageAsset {
    return {
      publicId: raw.public_id,
      secureUrl: raw.secure_url,
      width: raw.width,
      height: raw.height,
      format: raw.format,
      resourceType: raw.resource_type,
      bytes: raw.bytes,
      originalFilename: raw.original_filename,
    };
  }
  private async assertRemoteImageReachable(
    fileUrl: string,
    fieldName?: string,
  ): Promise<void> {
    try {
      const response = await fetch(fileUrl, {
        method: 'GET',
        redirect: 'follow',
      });

      if (!response.ok) {
        throw new BadRequestException(
          'The provided image URL is not publicly reachable for ' +
            `${fieldName}`,
        );
      }

      const contentType = response.headers.get('content-type') || '';

      if (!contentType.startsWith('image/')) {
        throw new BadRequestException(
          'The provided URL does not point to a valid image for ' +
            `${fieldName}`,
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        'The provided image URL could not be reached. Please use a direct public image link for ' +
          `${fieldName}`,
      );
    }
  }
}
