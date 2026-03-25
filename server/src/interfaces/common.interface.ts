export interface CodeSnippet {
  language: string;
  code: string;
  filename: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ImageAssetInput {
  sourceType: 'url' | 'file';
  url?: string;
  file?: Express.Multer.File;
}

/* ---------------- content ---------------- */

export interface SubItemInput {
  subHeading: string;
  description?: string;
  points?: string[];
  images?: ImageAssetInput[];
  codeSnippet?: CodeSnippet[];
}

export interface PointInterface {
  label?: string;
  description?: string;
}

export interface ContentSectionInput {
  id: string;
  contentType: string;
  type: string;
  heading?: string;
  paragraphs?: string[];
  points?: PointInterface[];
  items?: SubItemInput[];
  questions?: FAQ[];
  images?: ImageAssetInput[];
  codeSnippet?: CodeSnippet[];
}

/* ---------------- media / author / metadata / seo ---------------- */

export interface MediaInput {
  type?: string;
  thumbnail?: ImageAssetInput;
  banner?: ImageAssetInput;
}

export interface AuthorInput {
  name?: string;
  avatar?: ImageAssetInput;
  linkedin?: string;
  github?: string;
}

export interface MetadataInput {
  publishedDate?: string;
  lastModified?: string;
  featured?: boolean;
  readTime?: number;
}

export interface SEOInput {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}