import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';
export type ContactUsDocument = HydratedDocument<ContactUs>;

@Schema({ collection: 'contact-us', timestamps: true })
export class ContactUs extends Document {
  @Prop({ type: String })
  name!: string;

  @Prop({ type: String })
  email!: string;

  @Prop({ type: String, nullable: true })
  organization!: string;

  @Prop({ type: String, nullable: true })
  message!: string;
}

export const ContactUsSchema = SchemaFactory.createForClass(ContactUs);
