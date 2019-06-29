import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class RegisterDto {
  @Field()
  readonly email: string;
  @Field()
  readonly password: string;
}
