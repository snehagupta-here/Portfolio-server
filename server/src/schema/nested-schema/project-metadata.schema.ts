import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Metadata } from './metadata-schema';

@Schema({ _id: false })
export class ProjectMetadata extends Metadata {
  @Prop()
  difficulty?: string;

  @Prop()
  category?: string;

  @Prop()
  duration?: string;

  @Prop()
  projectType?: string[];

  @Prop()
  completedAt?: Date;

  @Prop()
  tags?: string[];

  @Prop()
  status?: string[];
}

export const ProjectMetadataSchema =
  SchemaFactory.createForClass(ProjectMetadata);