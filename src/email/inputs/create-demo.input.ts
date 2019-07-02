import { InputType, Field, ID } from 'type-graphql';
import { PayloadDemoInput } from './payload-demo.input';

@InputType()
export class CreateDemoInput {
  @Field(() => ID)
  readonly board: string;
  @Field({ nullable: true })
  readonly list: string | null;
  @Field()
  readonly payload: PayloadDemoInput;
}
