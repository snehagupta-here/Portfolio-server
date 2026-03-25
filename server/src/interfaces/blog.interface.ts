import {
  ContentSectionInput,
  MediaInput,
  AuthorInput,
  MetadataInput,
  SEOInput,
} from './common.interface';

export interface ResolvedBlogInput {
  user_id: string;
  title: string;
  slug: string;
  description?: string;
  content?: ContentSectionInput[];
  media?: MediaInput;
  author?: AuthorInput;
  metadata?: MetadataInput;
  seo?: SEOInput;
  isActive?: boolean;
}

export interface ResolvedBlogUpdateInput {
  user_id?: string;
  title?: string;
  slug?: string;
  description?: string;
  content?: ContentSectionInput[];
  media?: MediaInput;
  author?: AuthorInput;
  metadata?: MetadataInput;
  seo?: SEOInput;
  isActive?: boolean;
}
