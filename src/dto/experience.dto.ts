import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CloudinaryAssetDto } from './cloudinary.dto';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const normalizeOptionalAsset = ({ value }: { value: unknown }) =>
  value === '' || value === null ? undefined : value;

export class ExperienceDto {
  @IsMongoId({
    message: 'user_id: user_id must be a valid ',
  })
  @IsNotEmpty({ message: 'user_id: user_id is required' })
  user_id!: string;

  @IsNotEmpty({ message: 'start_date: start_date is required' })
  @IsDateString(
    {},
    {
      message: 'start_date: start_date must be a valid date string',
    },
  )
  start_date!: string;

  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'end_date: end_date must be a valid date string',
    },
  )
  end_date?: string;

  @IsOptional()
  @IsString({ message: 'location: location must be a string' })
  location?: string;

  @IsString({ message: 'designation: designation must be a string' })
  @IsNotEmpty({ message: 'designation: designation is required' })
  designation!: string;

  @IsOptional()
  @IsString({ message: 'description: description must be a string' })
  description?: string;

  @IsOptional()
  @IsArray({ message: 'responsibilities: responsibilities must be an array' })
  @IsString({
    each: true,
    message: 'responsibilities: each responsibility must be a string',
  })
  responsibilities?: string[];

  @IsString({
    message: 'organization_name: organization_name must be a string',
  })
  @IsNotEmpty({ message: 'organization_name: organization_name is required' })
  organization_name!: string;

  @Transform(normalizeOptionalAsset)
  @IsOptional()
  @ValidateNested()
  @Type(() => CloudinaryAssetDto)
  organization_logo_url?: CloudinaryAssetDto;

  @IsOptional()
  @Transform(trimString)
  @ValidateIf((_, value) => value !== '')
  @IsUrl(
    {},
    { message: 'organization_url: organization_url must be a valid URL' },
  )
  organization_url?: string;

  @IsOptional()
  @IsArray({ message: 'tech_stack: tech_stack must be an array' })
  @IsString({
    each: true,
    message: 'tech_stack: each tech stack item must be a string',
  })
  tech_stack?: string[];
}

export class UpdateExperienceDto {
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'start_date: start_date must be a valid date string',
    },
  )
  start_date?: string;

  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'end_date: end_date must be a valid date string',
    },
  )
  end_date?: string;

  @IsOptional()
  @IsString({ message: 'location: location must be a string' })
  location?: string;

  @IsOptional()
  @IsString({ message: 'designation: designation must be a string' })
  designation?: string;

  @IsOptional()
  @IsString({ message: 'description: description must be a string' })
  description?: string;

  @IsOptional()
  @IsArray({ message: 'responsibilities: responsibilities must be an array' })
  @IsString({
    each: true,
    message: 'responsibilities: each responsibility must be a string',
  })
  responsibilities?: string[];

  @IsOptional()
  @IsString({
    message: 'organization_name: organization_name must be a string',
  })
  organization_name?: string;

  @IsOptional()
  @Transform(normalizeOptionalAsset)
  @ValidateNested()
  @Type(() => CloudinaryAssetDto)
  organization_logo_url?: CloudinaryAssetDto;

  @IsOptional()
  @Transform(trimString)
  @ValidateIf((_, value) => value !== '')
  @IsUrl(
    {},
    { message: 'organization_url: organization_url must be a valid URL' },
  )
  organization_url?: string;

  @IsOptional()
  @IsArray({ message: 'tech_stack: tech_stack must be an array' })
  @IsString({
    each: true,
    message: 'tech_stack: each tech stack item must be a string',
  })
  tech_stack?: string[];
}

export class ExperienceUserParamDto {
  @IsMongoId({
    message: 'user_id: user_id must be a valid',
  })
  @IsNotEmpty({ message: 'user_id: user_id is required' })
  user_id!: string;
}

export class ExperienceScopedIdParamDto extends ExperienceUserParamDto {
  @IsMongoId({
    message: 'id: id must be a valid',
  })
  @IsNotEmpty({ message: 'id: id is required' })
  id!: string;
}

export class SearchExperienceQueryDto {
  @IsOptional()
  @IsString({ message: 'designation: designation must be a string' })
  designation?: string;

  @IsOptional()
  @IsString({
    message: 'organization_name: organization_name must be a string',
  })
  organization_name?: string;
}
