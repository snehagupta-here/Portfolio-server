import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ImageAsset, ImageAssetSchema } from './image-asset.schema';

@Schema({ _id: false })
export class Media {
  @Prop({ type: String })
  type!: string;

  @Prop({ type: ImageAssetSchema })
  thumbnail!: ImageAsset;

  @Prop({ type: ImageAssetSchema })
  banner?: ImageAsset;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
