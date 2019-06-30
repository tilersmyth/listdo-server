import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { BoardService } from './board.service';
import { CreateInput } from './inputs/create.input';
import { CreateBoardDto } from './dto/create.dto';
import { AddMemberInput } from './inputs/addMember.input';
import { AddMemberDto } from './dto/addMember.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ExpressContext } from '../types/context';

@Resolver()
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Mutation(() => CreateBoardDto)
  @UseGuards(AuthGuard)
  async createBoard(
    @Args('input') input: CreateInput,
    @Context() ctx: ExpressContext,
  ) {
    return this.boardService.create(input, ctx);
  }

  @Mutation(() => AddMemberDto)
  async addMember(@Args('input') input: AddMemberInput) {
    return this.boardService.addMember(input);
  }
}
