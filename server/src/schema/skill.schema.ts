import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { SkillCategoryEnum } from 'src/enums';

export type SkillDocument = HydratedDocument<Skill>;

@Schema({ collection: 'skills', timestamps: true })
export class Skill extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id!: Types.ObjectId;

  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String })
  icon!: string;

  @Prop({
    type: Number,
    min: 0,
    max: 10,
    required: true,
  })
  scale!: number;

  @Prop({
    type: Number,
    min: 0,
  })
  yoe!: number;

  @Prop({
    type: String,
    enum: SkillCategoryEnum,
    required: true,
  })
  category!: SkillCategoryEnum;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
