import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PositionEnum } from 'src/enums';
import { CloudinaryAssetDto } from './cloudinary.dto';

const ALLOWED_ASSET_KEYS = new Set([
  'publicId',
  'secureUrl',
  'width',
  'height',
  'format',
  'resourceType',
  'bytes',
  'originalFilename',
]);

const ALLOWED_RESOURCE_TYPES = new Set(['image', 'raw', 'video', 'auto']);

function isValidUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return false;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

@ValidatorConstraint({ name: 'isCloudinaryAssetOrUrl', async: false })
class IsCloudinaryAssetOrUrlConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (value === undefined || value === null) {
      return true;
    }

    if (typeof value === 'string') {
      return isValidUrl(value);
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      return false;
    }

    const asset = value as Record<string, unknown>;
    const keys = Object.keys(asset);

    if (!keys.every((key) => ALLOWED_ASSET_KEYS.has(key))) {
      return false;
    }

    if (
      typeof asset.publicId !== 'string' ||
      asset.publicId.trim().length === 0 ||
      !isValidUrl(asset.secureUrl)
    ) {
      return false;
    }

    if (
      asset.width !== undefined &&
      (!Number.isInteger(asset.width) || (asset.width as number) < 0)
    ) {
      return false;
    }

    if (
      asset.height !== undefined &&
      (!Number.isInteger(asset.height) || (asset.height as number) < 0)
    ) {
      return false;
    }

    if (asset.format !== undefined && typeof asset.format !== 'string') {
      return false;
    }

    if (
      asset.resourceType !== undefined &&
      (typeof asset.resourceType !== 'string' ||
        !ALLOWED_RESOURCE_TYPES.has(asset.resourceType))
    ) {
      return false;
    }

    if (
      asset.bytes !== undefined &&
      (!Number.isInteger(asset.bytes) || (asset.bytes as number) < 0)
    ) {
      return false;
    }

    if (
      asset.originalFilename !== undefined &&
      typeof asset.originalFilename !== 'string'
    ) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property}: ${args.property} must be a valid URL string or a valid cloudinary asset object`;
  }
}

export class AchievementDto {
  @IsMongoId()
  @IsNotEmpty()
  user_id!: string;

  @IsDateString()
  achievement_date!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsEnum(PositionEnum)
  position!: PositionEnum;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  competition_name!: string;

  @IsArray()
  @IsOptional()
  @Validate(IsCloudinaryAssetOrUrlConstraint, { each: true })
  images?: (CloudinaryAssetDto | string)[];

  @IsOptional()
  @Validate(IsCloudinaryAssetOrUrlConstraint)
  certificate_url?: CloudinaryAssetDto | string;
}

export class UpdateAchievementDto {
  @IsOptional()
  @IsDateString()
  achievement_date?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsEnum(PositionEnum)
  position?: PositionEnum;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  competition_name?: string;

  @IsOptional()
  @IsArray()
  @Validate(IsCloudinaryAssetOrUrlConstraint, { each: true })
  images?: (CloudinaryAssetDto | string)[];

  @IsOptional()
  @Validate(IsCloudinaryAssetOrUrlConstraint)
  certificate_url?: CloudinaryAssetDto | string;
}

export class SearchAchievementQueryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(PositionEnum)
  position?: PositionEnum;

  @IsOptional()
  @IsString()
  competition_name?: string;
}

export class AchievementUserParamDto {
  @IsMongoId({
    message: 'user_id: user_id must be a valid',
  })
  @IsNotEmpty({ message: 'user_id: user_id is required' })
  user_id!: string;
}

export class AchievementScopedIdParamDto extends AchievementUserParamDto {
  @IsMongoId({
    message: 'id: id must be a valid',
  })
  @IsNotEmpty({ message: 'id: id is required' })
  id!: string;
}
