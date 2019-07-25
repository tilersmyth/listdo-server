import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { BoardService } from './board.service';
import { CreateInput } from './inputs/create.input';
import { AddMemberInput } from './inputs/add-member.input';
import { AddMemberDto } from './dto/add-member.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ExpressContext } from '../types/context';
import { AddMemberGuard } from './guards/add-member.guard';
import { BoardDto } from './dto/board.dto';

@Resolver()
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Query(() => [BoardDto])
  @UseGuards(AuthGuard)
  async allBoards(@Context() ctx: ExpressContext) {
    return this.boardService.findAll(ctx);
  }

  @Mutation(() => BoardDto)
  @UseGuards(AuthGuard)
  async createBoard(
    @Args('input') input: CreateInput,
    @Context() ctx: ExpressContext,
  ) {
    return this.boardService.create(input, ctx);
  }

  @Mutation(() => AddMemberDto)
  @UseGuards(AddMemberGuard)
  async addMember(@Args('input') input: AddMemberInput) {
    return this.boardService.addMember(input);
  }
}
