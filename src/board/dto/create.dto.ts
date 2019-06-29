import { ObjectType, Field, Int } from 'type-graphql';
import { BoardDto } from './board.dto';

@ObjectType()
export class CreateBoardDto {
  @Field({ nullable: true })
  readonly board: BoardDto;
  @Field({ nullable: true })
  readonly error: string;
}
