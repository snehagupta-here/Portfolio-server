import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ImageAsset, ImageAssetSchema } from './image-asset.schema';

@Schema({ _id: false })
export class Author {
  @Prop() name!: string;

  @Prop({ type: ImageAssetSchema })
  avatar!: ImageAsset;

  @Prop() github!: string;
  @Prop() linkedin!: string;
}
export const AuthorSchema = SchemaFactory.createForClass(Author);