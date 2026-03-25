import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class SEO {
  @Prop({ type: String })
  metaTitle!: string;

  @Prop({ type: String })
  metaDescription!: string;

  @Prop({ type: [String], default: [] })
  keywords!: string[];
}

export const SEOSchema = SchemaFactory.createForClass(SEO);