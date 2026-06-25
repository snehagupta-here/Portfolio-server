import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { envSchema } from 'src/config';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
export class SocialLink {
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String })
  icon?: string;

  @Prop({ type: String, required: true })
  url!: string;
}

const SocialLinkSchema = SchemaFactory.createForClass(SocialLink);

@Schema({ _id: false })
export class UserFileAsset {
  @Prop({ type: String })
  fileName?: string;

  @Prop({ type: String })
  url?: string;

  @Prop({ type: String })
  publicId?: string;

  @Prop({ type: String })
  secureUrl?: string;

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

const UserFileAssetSchema = SchemaFactory.createForClass(UserFileAsset);

@Schema({ _id: false })
export class UserHighlight {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, required: true })
  description!: string;
}

const UserHighlightSchema = SchemaFactory.createForClass(UserHighlight);

@Schema({ _id: false })
export class UserSkill {
  @Prop({ type: Types.ObjectId, ref: 'Skill', required: true })
  skill_id!: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 0, max: 50 })
  yoe!: number;

  @Prop({ type: Number, required: true, min: 0, max: 10 })
  scale!: number;
}

@Schema({ _id: false })
export class UserEnvSchema {
  @Prop({ type: String })
  githubToken!: string;
}

const UserSkillSchema = SchemaFactory.createForClass(UserSkill);

@Schema({ collection: 'users', timestamps: true })
export class User extends Document {
  @Prop({ type: String })
  name!: string;

  @Prop({ type: String })
  title!: string;

  @Prop({ type: String })
  tagline!: string;

  @Prop({ type: String })
  bio!: string;

  @Prop({
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    sparse: true,
  })
  email?: string;

  @Prop({ type: String, select: false })
  password_hash?: string;

  @Prop({ type: UserFileAssetSchema })
  avatar?: UserFileAsset;

  @Prop({ type: UserFileAssetSchema })
  aboutImage?: UserFileAsset;

  @Prop({ type: UserFileAssetSchema })
  resume?: UserFileAsset;

  @Prop({ type: String })
  aboutHeading!: string;

  @Prop({ type: String })
  aboutBio!: string;

  @Prop({ type: String })
  totalYearsExperience!: string;

  @Prop({ type: String })
  projectsCompleted!: string;

  @Prop({ type: String })
  location!: string;

  @Prop({ type: [String], default: [] })
  paragraphs!: string[];

  @Prop({ type: [UserHighlightSchema], default: [] })
  highlights!: UserHighlight[];

  @Prop({ type: [SocialLinkSchema], default: [] })
  socialLinks!: SocialLink[];

  @Prop({ type: [UserSkillSchema], default: [] })
  skills!: UserSkill[];

  @Prop({ type: UserEnvSchema })
  env!: UserEnvSchema;
}

export const UserSchema = SchemaFactory.createForClass(User);

const sanitizeUser = (
  _doc: UserDocument,
  ret: User & { password_hash?: string },
) => {
  delete ret.password_hash;
  return ret;
};

UserSchema.set('toJSON', {
  transform: sanitizeUser,
});

UserSchema.set('toObject', {
  transform: sanitizeUser,
});
