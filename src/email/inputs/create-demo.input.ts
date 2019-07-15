import { InputType, Field, ID } from 'type-graphql';
import { PayloadDemoInput } from './payload-demo.input';
import { MemberDemoInput } from './member-demo.input';
import { EmailPayload, EmailMember } from '../interfaces';

@InputType()
export class CreateDemoInput {
  @Field(() => ID)
  readonly board: string;
  @Field({ nullable: true })
  readonly list: string | null;
  @Field(() => [MemberDemoInput])
  readonly members: EmailMember[];
  @Field(() => [PayloadDemoInput])
  readonly payload: EmailPayload;
}
