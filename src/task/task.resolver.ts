import { Resolver, Query, Context, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { TaskService } from './task.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ExpressContext } from '../types/context';
import { BoardTasksInput } from './inputs/find-board-tasks.input';
import { TaskDto } from './dto/task.dto';

@Resolver('Task')
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Query(() => [TaskDto])
  @UseGuards(AuthGuard)
  async tasksByBoard(
    @Args('input') input: BoardTasksInput,
    @Context() ctx: ExpressContext,
  ) {
    return this.taskService.findTasksByBoard(input, ctx);
  }
}
