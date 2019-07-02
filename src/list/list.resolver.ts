import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { ListService } from './list.service';
import { CreateListInput } from './inputs/create.input';
import { CreateListDto } from './dto/create.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ExpressContext } from '../types/context';

@Resolver()
export class ListResolver {
  constructor(private readonly listService: ListService) {}

  @Mutation(() => CreateListDto)
  @UseGuards(AuthGuard)
  async createList(
    @Args('input') input: CreateListInput,
    @Context() ctx: ExpressContext,
  ) {
    return this.listService.create(input, ctx);
  }
}
