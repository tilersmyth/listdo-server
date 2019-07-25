import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class EmailPayloadDto {
  @Field()
  readonly subject: string;
  @Field()
  readonly text: string;
  @Field()
  readonly textAsHtml: string;
  @Field()
  readonly textPreview: string;
  @Field()
  readonly date: string;
}
