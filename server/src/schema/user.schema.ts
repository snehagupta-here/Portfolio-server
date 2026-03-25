import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { ImageAsset, ImageAssetSchema } from './nested-schema/image-asset.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
class SocialLink {
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String })
  icon!: string;

  @Prop({ type: String, required: true })
  url!: string;
}

const SocialLinkSchema = SchemaFactory.createForClass(SocialLink);

@Schema({ _id: false })
class UserSkill {
  @Prop({ type: Types.ObjectId, ref: 'Skill', required: true })
  skill_id!: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 0 })
  yoe!: number;

  @Prop({ type: Number, required: true, min: 0 })
  scale!: number;
}

const UserSkillSchema = SchemaFactory.createForClass(UserSkill);

@Schema({ collection: 'users', timestamps: true })
export class User extends Document {
  @Prop({ type: String })
  about!: string;

  @Prop({ type: String })
  name!: string;

  @Prop({ type: ImageAssetSchema })
  profile_image?: ImageAsset;

  @Prop({ type: ImageAssetSchema })
  resume?: ImageAsset;

  @Prop({ type: [SocialLinkSchema], default: [] })
  links!: SocialLink[];

  @Prop({ type: [UserSkillSchema], default: [] })
  skills!: UserSkill[];
}

export const UserSchema = SchemaFactory.createForClass(User);