import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { SEO, SEOSchema } from './nested-schema/seo.schema';
import { Metadata, MetadataSchema } from './nested-schema/metadata-schema';
import { Author, AuthorSchema } from './nested-schema/author.schema';
import { Media, MediaSchema } from './nested-schema/media.schema';
import { ContentSection, ContentSectionSchema } from './nested-schema/content-section.schema';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ collection: 'blogs', timestamps: true })
export class Blog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id!: Types.ObjectId;

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

  @Prop({ type: Boolean, default: false })
  isActive!: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
