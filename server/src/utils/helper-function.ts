import { BadRequestException, Injectable } from '@nestjs/common';
import { ImageValidationService } from 'src/common/image/image-validation.service';
import { AuthorDto, ContentSectionDto, MediaDto } from 'src/dto';
import {
  ContentSectionInput,
  SubItemInput,
  ImageAssetInput,
} from 'src/interfaces';
import { slugify } from './slugify';
import { ImageResolverService } from 'src/common/image/image-resolver.service';

@Injectable()
export class ComplexFuntionResolverService {
  constructor(
    private readonly imageValidationService: ImageValidationService,
    private readonly imageResolverService: ImageResolverService,
  ) {}

  resolveSingleImageInput(
    url: string | undefined,
    file: Express.Multer.File | undefined,
    fieldName: string,
  ): ImageAssetInput | undefined {
    const trimmedUrl = url?.trim();
    const hasUrl = !!trimmedUrl;
    const hasFile = !!file;

    if (hasUrl && hasFile) {
      throw new BadRequestException(
        `${fieldName}: provide either an image URL or an uploaded file, not both.`,
      );
    }

    if (!hasUrl && !hasFile) {
      return undefined;
    }

    if (hasFile) {
      return {
        sourceType: 'file',
        file,
      };
    }

    this.imageValidationService.validateUrl(
      trimmedUrl!,
      {
        allowedProtocols: ['https:'],
      },
      fieldName,
    );

    return {
      sourceType: 'url',
      url: trimmedUrl!,
    };
  }

  buildFileMap(files: Express.Multer.File[]): Map<string, Express.Multer.File> {
    const map = new Map<string, Express.Multer.File>();

    for (const file of files) {
      this.imageValidationService.validateImage(
        file,
        {
          allowSvg: true,
          maxSizeBytes: 5 * 1024 * 1024,
        },
        file.fieldname,
      );

      map.set(file.fieldname, file);
    }

    return map;
  }

  resolveMedia(
    media: MediaDto | undefined,
    fileMap: Map<string, Express.Multer.File>,
  ) {
    if (
      !media &&
      !fileMap.has('media.thumbnail') &&
      !fileMap.has('media.banner')
    ) {
      return undefined;
    }

    return {
      type: media?.type,
      thumbnail: this.resolveSingleImageInput(
        media?.thumbnail,
        fileMap.get('media.thumbnail'),
        'media.thumbnail',
      ),
      banner: this.resolveSingleImageInput(
        media?.banner,
        fileMap.get('media.banner'),
        'media.banner',
      ),
    };
  }

  resolveAuthor(
    author: AuthorDto | undefined,
    fileMap: Map<string, Express.Multer.File>,
  ) {
    if (!author && !fileMap.has('author.avatar')) {
      return undefined;
    }

    return {
      name: author?.name,
      linkedin: author?.linkedin,
      github: author?.github,
      avatar: this.resolveSingleImageInput(
        author?.avatar,
        fileMap.get('author.avatar'),
        'author.avatar',
      ),
    };
  }

  resolveContent(
    content: ContentSectionDto[] | undefined,
    fileMap: Map<string, Express.Multer.File>,
  ): ContentSectionInput[] | undefined {
    if (!content?.length) {
      return undefined;
    }

    return content.map((section, sectionIndex) => {
      const resolvedSectionImages = this.resolveImageArray(
        section.images,
        fileMap,
        `content[${sectionIndex}].images`,
      );

      const resolvedItems: SubItemInput[] | undefined = section.items?.map(
        (item, itemIndex) => {
          const resolvedItemImages = this.resolveImageArray(
            item.images,
            fileMap,
            `content[${sectionIndex}].items[${itemIndex}].images`,
          );

          return {
            subHeading: item.subHeading,
            description: item.description,
            points: item.points,
            images: resolvedItemImages,
            codeSnippet: item.codeSnippet,
          };
        },
      );

      return {
        id: section.id,
        contentType: section.contentType,
        type: section.type,
        heading: section.heading,
        paragraphs: section.paragraphs,
        points: section.points,
        items: resolvedItems,
        questions: section.questions,
        images: resolvedSectionImages,
        codeSnippet: section.codeSnippet,
      };
    });
  }

  resolveImageArray(
    urlArray: string[] | undefined,
    fileMap: Map<string, Express.Multer.File>,
    baseField: string,
  ): ImageAssetInput[] | undefined {
    const results: ImageAssetInput[] = [];

    if (urlArray?.length) {
      urlArray.forEach((url, index) => {
        const fieldname = `${baseField}[${index}]`;
        const file = fileMap.get(fieldname);

        const resolved = this.resolveSingleImageInput(url, file, fieldname);
        if (resolved) results.push(resolved);
      });
    }

    let fileIndex = 0;
    while (true) {
      const fieldname = `${baseField}[${fileIndex}]`;

      if (!urlArray?.[fileIndex] && fileMap.has(fieldname)) {
        const resolved = this.resolveSingleImageInput(
          undefined,
          fileMap.get(fieldname),
          fieldname,
        );
        if (resolved) results.push(resolved);
      }

      if (!fileMap.has(fieldname) && !urlArray?.[fileIndex]) {
        break;
      }

      fileIndex += 1;
    }

    return results.length ? results : undefined;
  }

  async resolveContentSectionForUploadingImage(
    sections: ContentSectionInput[],
    slug: string,
    key: string,
  ) {
    return Promise.all(
      sections.map(async (section, sectionIndex) => {
        const resolvedImages = section.images?.length
          ? await Promise.all(
              section.images.map((image, imageIndex) =>
                this.uploadSingleAsset(
                  image,
                  `portfolio/${key}/content`,
                  `${slugify(slug)}-section-${sectionIndex}-image-${imageIndex}-${Date.now()}`,
                  `content[${sectionIndex}].images[${imageIndex}]`,
                ),
              ),
            )
          : [];

        const resolvedItems = section.items?.length
          ? await Promise.all(
              section.items.map(async (item, itemIndex) => {
                const resolvedItemImages = item.images?.length
                  ? await Promise.all(
                      item.images.map((image, imageIndex) =>
                        this.uploadSingleAsset(
                          image,
                          `portfolio/${key}/content`,
                          `${slugify(slug)}-section-${sectionIndex}-item-${itemIndex}-image-${imageIndex}-${Date.now()}`,
                          `content[${sectionIndex}].items[${itemIndex}].images[${imageIndex}]`,
                        ),
                      ),
                    )
                  : [];

                return {
                  subHeading: item.subHeading,
                  description: item.description,
                  points: item.points,
                  images: resolvedItemImages,
                  codeSnippet: item.codeSnippet,
                };
              }),
            )
          : [];

        return {
          id: section.id,
          contentType: section.contentType,
          type: section.type,
          heading: section.heading,
          paragraphs: section.paragraphs,
          points: section.points,
          items: resolvedItems,
          questions: section.questions,
          images: resolvedImages,
          codeSnippet: section.codeSnippet,
        };
      }),
    );
  }

  async uploadSingleAsset(
    input: {
      sourceType: 'file' | 'url';
      file?: Express.Multer.File;
      url?: string;
    },
    folder: string,
    publicId: string,
    fieldName?: string,
  ) {
    const resolved = await this.imageResolverService.resolveSingleImage(
      {
        file: input.file,
        url: input.url,
      },
      {
        folder,
        publicId,
        overwrite: true,
        allowSvg: true,
        maxSizeBytes: 5 * 1024 * 1024,
      },
      fieldName,
    );

    return {
      publicId: resolved.asset.publicId,
      secureUrl: resolved.asset.secureUrl,
      width: resolved.asset.width,
      height: resolved.asset.height,
      format: resolved.asset.format,
      resourceType: resolved.asset.resourceType,
      bytes: resolved.asset.bytes,
      originalFilename: resolved.asset.originalFilename,
    };
  }
}
