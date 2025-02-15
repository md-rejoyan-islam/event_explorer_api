import { mergeResolvers } from "@graphql-tools/merge";
import enrolledEventResolver from "./enrolled.resolver";
import eventResolver from "./event.resolver";
import seedResolver from "./seed.resolver";
import userResolver from "./user.resolver";

// Assuming the resolvers are correctly typed as GraphQL resolvers
const resolvers = mergeResolvers([
  userResolver,
  eventResolver,
  enrolledEventResolver,
  seedResolver,
]);

export default resolvers;
