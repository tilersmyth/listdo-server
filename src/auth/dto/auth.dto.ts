import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class AuthDto {
  @Field()
  readonly path: string;
  @Field()
  readonly message: string;
}
