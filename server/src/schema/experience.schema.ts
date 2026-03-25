import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { ImageAsset, ImageAssetSchema } from './nested-schema/image-asset.schema';

export type ExperienceDocument = HydratedDocument<Experience>;

@Schema({ collection: 'experiences', timestamps: true })
export class Experience extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id!: Types.ObjectId;

  @Prop({ type: Date, required: true })
  start_date!: Date;

  @Prop({ type: Date, default: null })
  end_date!: Date;

  @Prop({ type: String })
  location!: string;

  @Prop({ type: String, required: true })
  designation!: string;

  @Prop({ type: String })
  description!: string;

  @Prop({ type: [String], default: [] })
  responsibilities!: string[];

  @Prop({ type: String, required: true })
  organization_name!: string;

  @Prop({ type: ImageAssetSchema })
  organization_logo_url!: ImageAsset;

  @Prop({ type: String })
  organization_url!: string;

  @Prop({ type: [String], default: [] })
  tech_stack!: string[];
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
