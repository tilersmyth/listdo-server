import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { CreateDemoInput } from './inputs/create-demo.input';
import { EmailDemoService } from './email-demo.service';
import { ExpressContext } from '../types/context';

@Resolver('Email')
export class EmailResolver {
  constructor(private readonly emailService: EmailDemoService) {}

  @Mutation(() => Boolean)
  async createDemoEmail(
    @Args('input') input: CreateDemoInput,
    @Context() { pubSub }: ExpressContext,
  ) {
    return this.emailService.createDemo(input, pubSub);
  }
}
