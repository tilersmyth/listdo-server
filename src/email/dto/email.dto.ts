import { ObjectType, Field } from 'type-graphql';
import { EmailPayloadDto } from './email-payload.dto';
import { EmailMemberDto } from './email-member.dto';
import { EmailMember, EmailPayload } from '../interfaces';

@ObjectType()
export class EmailDto {
  @Field({ nullable: true })
  readonly list: string | null;
  @Field(() => [EmailMemberDto])
  readonly members: EmailMember[];
  @Field(() => EmailPayloadDto)
  readonly payload: EmailPayload;
}
