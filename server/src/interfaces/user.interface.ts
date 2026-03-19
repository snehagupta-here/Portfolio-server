export interface SocialLink {
  name: string;
  icon?: string;
  url: string;
}

export interface UserSkill {
  skill_id: string;
  yoe: number;
  scale: number;
}

export interface UserCreate {
  about?: string;
  name: string;
  links?: SocialLink[];
  skills?: UserSkill[];
}

export interface UserUpdate {
  about?: string;
  name: string;
  links?: SocialLink[];
  skills?: UserSkill[];
}

export interface ResolvedUserInput {
  about?: string;
  name: string;
  links?: SocialLink[];
  skills?: UserSkill[];
  profile_image?: Express.Multer.File[];
  resume?: Express.Multer.File[];
}
