import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';
export type ContactUsDocument = HydratedDocument<ContactUs>;

@Schema({ collection: 'contact-me', timestamps: true })
export class ContactUs extends Document {
  @Prop({ type: String, required: true, trim: true })
  name!: string;

  @Prop({ type: String, required: true, trim: true, index: true })
  email!: string;

  @Prop({ type: String, required: true, trim: true })
  subject!: string;

  @Prop({ type: String, required: true, trim: true })
  message!: string;
}

export const ContactUsSchema = SchemaFactory.createForClass(ContactUs);
