import { ObjectType, Field, Int } from 'type-graphql';
import { AuthDto } from './auth.dto';

@ObjectType()
export class LoginDto {
  @Field(() => Int)
  readonly status: number;
  @Field({ nullable: true })
  readonly auth: AuthDto | null;
}
