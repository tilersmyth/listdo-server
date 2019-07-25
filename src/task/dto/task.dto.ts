import { ObjectType, Field } from 'type-graphql';
import { EmailDto } from '../../email/dto/email.dto';
import { EmailSchema } from '../../email/interfaces';

@ObjectType()
export class TaskDto {
  @Field(() => EmailDto)
  readonly email: EmailSchema;
}
