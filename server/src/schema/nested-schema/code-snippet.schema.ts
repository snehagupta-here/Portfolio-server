import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class CodeSnippet {
  @Prop() filename!: string;
  @Prop() language!: string;
  @Prop() description!: string;
  @Prop() code!: string;
}
export const CodeSnippetSchema = SchemaFactory.createForClass(CodeSnippet);