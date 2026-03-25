import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ImageAsset, ImageAssetSchema } from './image-asset.schema';
import { CodeSnippet, CodeSnippetSchema } from './code-snippet.schema';

@Schema({ _id: false })
export class SubItem {
  @Prop({ type: String })
  subHeading!: string;

  @Prop({ type: String })
  description!: string;

  @Prop({ type: [String], default: [] })
  points!: string[];

  @Prop({ type: [ImageAssetSchema], default: [] })
  images!: ImageAsset[];

  @Prop({ type: [CodeSnippetSchema], default: [] })
  codeSnippet!: CodeSnippet[];
}

export const SubItemSchema = SchemaFactory.createForClass(SubItem);