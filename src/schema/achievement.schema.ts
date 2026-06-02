import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Document,
  HydratedDocument,
  Schema as MongooseSchema,
  Types,
} from 'mongoose';
import { PositionEnum } from 'src/enums';
import { ImageAsset } from './image-asset.schema';

export type AchievementDocument = HydratedDocument<Achievement>;

@Schema({ collection: 'achievements', timestamps: true })
export class Achievement extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user_id!: Types.ObjectId;

  @Prop({ type: Date, required: true })
  achievement_date!: Date;

  @Prop({ type: String, required: true })
  title!: string;

  @Prop({
    type: String,
    enum: PositionEnum,
    required: true,
  })
  position!: PositionEnum;

  @Prop({ type: String })
  description!: string;

  @Prop({ type: String, required: true })
  competition_name!: string;

  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  images!: (ImageAsset | string)[];

  @Prop({ type: MongooseSchema.Types.Mixed })
  certificate_url!: ImageAsset | string;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);
