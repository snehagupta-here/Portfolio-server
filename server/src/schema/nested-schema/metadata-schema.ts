import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Metadata {
  @Prop({ type: Date })
  publishedDate!: Date;

  @Prop({ type: Date })
  lastModified!: Date;

  @Prop({ type: Boolean, default: false })
  featured!: boolean;

  @Prop({ type: Number })
  readTime!: number;

  @Prop({ default: 0 }) views!: number;

  @Prop({ default: 0 }) likes!: number;
}

export const MetadataSchema = SchemaFactory.createForClass(Metadata);