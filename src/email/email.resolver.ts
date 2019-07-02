import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CreateDemoInput } from './inputs/create-demo.input';
import { EmailDemoService } from './email-demo.service';

@Resolver('Email')
export class EmailResolver {
  constructor(private readonly emailService: EmailDemoService) {}

  @Mutation(() => Boolean)
  async createDemoEmail(@Args('input') input: CreateDemoInput) {
    return this.emailService.create(input);
  }
}
