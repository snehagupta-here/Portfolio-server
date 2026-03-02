import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { PositionEnum } from 'src/enums';

export type AchievementDocument = HydratedDocument<Achievement>;

@Schema({ collection: 'achievements', timestamps: true })
export class Achievement extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
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

  @Prop({ type: [String], default: [] })
  images!: string[];

  @Prop({ type: String })
  certificate_url!: string;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);
