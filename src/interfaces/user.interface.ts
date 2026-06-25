import { CloudinaryImageAsset } from 'src/interfaces/image.interface';

export interface SocialLink {
  id?: string;
  name: string;
  icon?: string;
  url: string;
}

export interface UserFileAsset extends Partial<CloudinaryImageAsset> {
  fileName?: string;
  url?: string;
}

export interface UserHighlight {
  id?: string;
  title: string;
  description: string;
}

export interface UserSkill {
  skill_id: string;
  yoe: number;
  scale: number;
}

export interface UserEnv {
  githubToken?: string;
}

export interface UserUpdate {
  name?: string;
  title?: string;
  tagline?: string;
  bio?: string;
  email?: string;
  avatar?: UserFileAsset;
  aboutImage?: UserFileAsset;
  aboutHeading?: string;
  aboutBio?: string;
  totalYearsExperience?: string;
  projectsCompleted?: string;
  location?: string;
  paragraphs?: string[];
  highlights?: UserHighlight[];
  socialLinks?: SocialLink[];
  skills?: UserSkill[];
  resume?: UserFileAsset;
  env?: UserEnv;
}
