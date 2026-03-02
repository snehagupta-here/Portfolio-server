import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';
import { SectionTypeEnum, ContentTypeEnum } from 'src/enums';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ _id: false })
class CodeSnippet {
  @Prop({ type: String })
  language!: string;

  @Prop({ type: String })
  code!: string;
}

const CodeSnippetSchema = SchemaFactory.createForClass(CodeSnippet);

@Schema({ _id: false })
class FAQ {
  @Prop({ type: String })
  question!: string;

  @Prop({ type: String })
  answer!: string;
}

const FAQSchema = SchemaFactory.createForClass(FAQ);

@Schema({ _id: false })
class SubItem {
  @Prop({ type: String })
  subHeading!: string;

  @Prop({ type: String })
  description!: string;

  @Prop({ type: [String], default: [] })
  points!: string[];

  @Prop({ type: [String], default: [] })
  images!: string[];

  @Prop({ type: [CodeSnippetSchema], default: [] })
  codeSnippet!: CodeSnippet[];
}

const SubItemSchema = SchemaFactory.createForClass(SubItem);

@Schema({ _id: false })
class ContentSection {
  @Prop({ type: String, required: true })
  id!: string;

  @Prop({
    type: String,
    enum: ContentTypeEnum,
    required: true,
  })
  contentType!: ContentTypeEnum;

  @Prop({
    type: String,
    enum: SectionTypeEnum,
    required: true,
  })
  type!: SectionTypeEnum;

  @Prop({ type: String })
  heading!: string;

  @Prop({ type: String })
  text!: string;

  @Prop({ type: [String], default: [] })
  points!: string[];

  @Prop({ type: [SubItemSchema], default: [] })
  items!: SubItem[];

  @Prop({ type: [FAQSchema], default: [] })
  questions!: FAQ[];

  @Prop({ type: [String], default: [] })
  images!: string[];

  @Prop({ type: [CodeSnippetSchema], default: [] })
  codeSnippet!: CodeSnippet[];
}

const ContentSectionSchema = SchemaFactory.createForClass(ContentSection);

@Schema({ _id: false })
class Thumbnail {
  @Prop({ type: String })
  url!: string;

  @Prop({ type: String })
  publicId!: string;

  @Prop({ type: Number })
  size!: number;

  @Prop({ type: String })
  mimeType!: string;
}

const ThumbnailSchema = SchemaFactory.createForClass(Thumbnail);

@Schema({ _id: false })
class Media {
  @Prop({ type: String })
  type!: string;

  @Prop({ type: ThumbnailSchema })
  thumbnail!: Thumbnail;
}

const MediaSchema = SchemaFactory.createForClass(Media);

@Schema({ _id: false })
class Author {
  @Prop({ type: String })
  name!: string;

  @Prop({ type: String })
  avatar!: string;
}

const AuthorSchema = SchemaFactory.createForClass(Author);

@Schema({ _id: false })
class Metadata {
  @Prop({ type: String })
  status!: string;

  @Prop({ type: Date })
  publishedDate!: Date;

  @Prop({ type: Date })
  lastModified!: Date;

  @Prop({ type: Boolean, default: false })
  featured!: boolean;

  @Prop({ type: Boolean, default: false })
  trending!: boolean;

  @Prop({ type: Number })
  readTime!: number;
}

const MetadataSchema = SchemaFactory.createForClass(Metadata);

@Schema({ _id: false })
class SEO {
  @Prop({ type: String })
  metaTitle!: string;

  @Prop({ type: String })
  metaDescription!: string;

  @Prop({ type: [String], default: [] })
  keywords!: string[];

  @Prop({ type: String })
  ogImage!: string;
}

const SEOSchema = SchemaFactory.createForClass(SEO);

@Schema({ collection: 'blogs', timestamps: true })
export class Blog extends Document {
  @Prop({ type: String })
  title!: string;

  @Prop({ type: String, unique: true })
  slug!: string;

  @Prop({ type: String })
  description!: string;

  @Prop({ type: [ContentSectionSchema], default: [] })
  content!: ContentSection[];

  @Prop({ type: MediaSchema })
  media!: Media;

  @Prop({ type: AuthorSchema })
  author!: Author;

  @Prop({ type: MetadataSchema })
  metadata!: Metadata;

  @Prop({ type: SEOSchema })
  seo!: SEO;

  @Prop({ type: Boolean, default: true })
  isActive!: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
