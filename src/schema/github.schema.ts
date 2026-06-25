import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
export type GithubCacheDocument = HydratedDocument<GithubCache>;

@Schema({ collection: 'github', timestamps: true })
export class GithubCache extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  user_id!: Types.ObjectId;

  @Prop({ type: Object, default: {} })
  data!: Record<string, any>;

  @Prop({ required: true })
  githubToken!: string;
}

export const GithubCacheSchema = SchemaFactory.createForClass(GithubCache);