import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';

export type TestimonialDocument = HydratedDocument<Testimonial>;

@Schema({ collection: 'testimonials', timestamps: true })
export class Testimonial extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id!: Types.ObjectId;

  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String, required: true })
  description!: string;

  @Prop({ type: String })
  designation!: string;

  @Prop({
    type: Number,
    min: 1,
    max: 5,
    required: true,
  })
  rating!: number;

  @Prop({ type: Date, required: true })
  testimonial_date!: Date;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
