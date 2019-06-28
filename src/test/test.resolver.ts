import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { TestInput } from './inputs/test.input';

@Resolver()
export class TestResolver {
  constructor(private readonly testService: TestService) {}

  @Query(() => [CreateTestDto])
  async test() {
    return this.testService.findAll();
  }

  @Mutation(() => CreateTestDto)
  async createTest(@Args('input') input: TestInput) {
    return this.testService.create(input);
  }
}
