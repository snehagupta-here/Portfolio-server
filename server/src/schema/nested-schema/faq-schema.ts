import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class FAQ {
  @Prop({ type: String })
  question!: string;

  @Prop({ type: String })
  answer!: string;
}

export const FAQSchema = SchemaFactory.createForClass(FAQ);