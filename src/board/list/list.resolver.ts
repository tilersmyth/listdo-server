import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ListService } from './list.service';
import { CreateListInput } from './inputs/create.input';
import { CreateListDto } from './dto/create.dto';

@Resolver()
export class ListResolver {
  constructor(private readonly listService: ListService) {}

  @Mutation(() => CreateListDto)
  async createList(@Args('input') input: CreateListInput) {
    return this.listService.create(input);
  }
}
