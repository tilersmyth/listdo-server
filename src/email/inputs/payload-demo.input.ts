import { InputType, Field } from 'type-graphql';
import { UserInput } from '../../auth/inputs/user.input';
import { UserProfile } from '../../auth/interfaces/user-profile.interface';

@InputType()
export class PayloadDemoInput {
  @Field()
  readonly messageId: string;
  @Field()
  readonly replyId: string;
  @Field(() => UserInput)
  readonly from: UserProfile;
  @Field(() => [UserInput])
  readonly to: UserProfile[];
  @Field(() => [UserInput])
  readonly cc: UserProfile[];
  @Field()
  readonly subject: string;
  @Field({ nullable: true })
  readonly bodyText: string | null;
  @Field({ nullable: true })
  readonly bodyHtml: string | null;
}
