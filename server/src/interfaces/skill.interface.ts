import { SkillCategoryEnum } from 'src/enums';
import { CloudinaryImageAsset } from '../common/image/image.types';

export interface SkillIcon {
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format?: string;
  resourceType?: string;
  bytes?: number;
  originalFilename?: string;
}

// export interface CreateSkill {
//   name: string;
//   icon?: SkillIcon;
//   category: SkillCategoryEnum;
// }

export interface UpdateSkill {
  name?: string;
  icon?: SkillIcon;
  category: SkillCategoryEnum;
}

export interface SkillResponse {
  _id: string;
  name: string;
  icon?: CloudinaryImageAsset;
  category: SkillCategoryEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ResolvedSkillInput {
  name: string;
  category: SkillCategoryEnum;
  icon: {
    sourceType: 'file' | 'url';
    file?: Express.Multer.File;
    url?: string;
  };
}