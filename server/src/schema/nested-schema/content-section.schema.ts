import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ImageAsset, ImageAssetSchema } from './image-asset.schema';
import { CodeSnippet, CodeSnippetSchema } from './code-snippet.schema';
import { ContentTypeEnum, SectionTypeEnum } from 'src/enums';
import { SubItem, SubItemSchema } from './sub-item.schema';
import { FAQ, FAQSchema } from './faq-schema';
  
@Schema({ _id: false })
export class ContentSection {
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

  @Prop({ type: [String], default: [] })
  paragraphs!: string[];

  @Prop({ type: [{ label: String, description: String }], default: [] })
  points!: { label: string; description: string }[];

  @Prop({ type: [SubItemSchema], default: [] })
  items!: SubItem[];

  @Prop({ type: [FAQSchema], default: [] })
  questions!: FAQ[];

  @Prop({ type: [ImageAssetSchema], default: [] })
  images!: ImageAsset[];

  @Prop({ type: [CodeSnippetSchema], default: [] })
  codeSnippet!: CodeSnippet[];
}

export const ContentSectionSchema =
  SchemaFactory.createForClass(ContentSection);
