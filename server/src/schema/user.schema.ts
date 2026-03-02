import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';

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

@Schema({ collection: 'users', timestamps: true })
export class User extends Document {
  @Prop({ type: String })
  about!: string;

  @Prop({ type: String })
  resume!: string;

  @Prop({ type: [SocialLinkSchema], default: [] })
  links!: SocialLink[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Skill' }], default: [] })
  skills!: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
