import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { BoardService } from './board.service';
import { CreateInput } from './inputs/create.input';
import { CreateBoardDto } from './dto/create.dto';
import { AddMemberInput } from './inputs/addMember.input';
import { AddMemberDto } from './dto/addMember.dto';

@Resolver()
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Mutation(() => CreateBoardDto)
  async createBoard(@Args('input') input: CreateInput) {
    return this.boardService.create(input);
  }

  @Mutation(() => AddMemberDto)
  async addMember(@Args('input') input: AddMemberInput) {
    return this.boardService.addMember(input);
  }
}
