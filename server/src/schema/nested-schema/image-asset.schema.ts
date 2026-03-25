import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ImageAsset {
  @Prop({ type: String, required: true })
  publicId!: string;

  @Prop({ type: String, required: true })
  secureUrl!: string;

  @Prop({ type: Number })
  width?: number;

  @Prop({ type: Number })
  height?: number;

  @Prop({ type: String })
  format?: string;

  @Prop({ type: String })
  resourceType?: string;

  @Prop({ type: Number })
  bytes?: number;

  @Prop({ type: String })
  originalFilename?: string;
}

export const ImageAssetSchema = SchemaFactory.createForClass(ImageAsset);