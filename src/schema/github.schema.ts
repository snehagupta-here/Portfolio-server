import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type GithubCacheDocument = HydratedDocument<GithubCache>;

@Schema({ collection: 'github_cache', timestamps: true })
export class GithubCache extends Document {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true, type: Object })
  data: Record<string, any>;

  @Prop({ required: true })
  expiresAt: Date;
}

export const GithubCacheSchema = SchemaFactory.createForClass(GithubCache);