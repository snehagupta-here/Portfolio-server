import { PositionEnum } from 'src/enums';
import { CloudinaryImageAsset } from './image.interface';

export interface CreateAchievement {
  user_id: string;
  achievement_date: string;
  title: string;
  position: PositionEnum;
  description?: string;
  competition_name: string;
  images?: (CloudinaryImageAsset | string)[];
  certificate_url?: CloudinaryImageAsset | string;
}

export interface UpdateAchievement {
  achievement_date?: string;
  title?: string;
  position?: PositionEnum;
  description?: string;
  competition_name?: string;
  images?: (CloudinaryImageAsset | string)[];
  certificate_url?: CloudinaryImageAsset | string;
}
