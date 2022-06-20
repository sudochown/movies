import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AttributesConfigProperties {
  field = 'field',
  isFilterable = 'isFilterable',
  isSortable = 'isSortable',
  isDefaultSortField = 'isDefaultSortField',
  useOnListing = 'useOnListing',
  useOnDetailsPage = 'useOnDetailsPage',
}

@Schema()
export class AttributesConfig {
  @ApiProperty({ type: String })
  @Prop({ unique: true, required: true })
  [AttributesConfigProperties.field]: string;

  @ApiPropertyOptional({ type: Number, default: 0 })
  @Prop()
  [AttributesConfigProperties.isFilterable]: number;

  @ApiPropertyOptional({ type: Number, default: 0 })
  @Prop()
  [AttributesConfigProperties.isSortable]: number;

  @ApiPropertyOptional({ type: Number, default: 0 })
  @Prop()
  [AttributesConfigProperties.isDefaultSortField]: number;

  @ApiPropertyOptional({ type: Number, default: 0 })
  @Prop()
  [AttributesConfigProperties.useOnListing]: number;

  @ApiPropertyOptional({ type: Number, default: 0 })
  @Prop()
  [AttributesConfigProperties.useOnDetailsPage]: number;
}

export type AttributesConfigDocument = AttributesConfig & Document;

export const AttributesConfigSchema =
  SchemaFactory.createForClass(AttributesConfig);
