import { ObjectType, Field } from 'type-graphql';
import { UserDto } from '../../auth/dto/user.dto.';
import { UserProfile } from '../../auth/interfaces/user-profile.interface';

@ObjectType()
export class EmailMemberDto {
  @Field(() => UserDto)
  readonly user: UserProfile;
  @Field()
  readonly role: string;
}
