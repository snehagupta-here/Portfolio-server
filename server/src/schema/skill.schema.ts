import { SkillCategoryEnum } from 'src/enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import {
  ImageAsset,
  ImageAssetSchema,
} from './nested-schema/image-asset.schema';

export type SkillDocument = HydratedDocument<Skill>;

@Schema({ collection: 'skills', timestamps: true })
export class Skill extends Document {
  @Prop({ type: String, required: true, trim: true })
  name!: string;

  @Prop({
    type: String,
    enum: SkillCategoryEnum,
    required: true,
  })
  category!: SkillCategoryEnum;

  @Prop({ type: ImageAssetSchema })
  icon?: ImageAsset;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);