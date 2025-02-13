const EnrolledTypes = `#graphql 
type Query {
  getEnrolledEventById(id: ID!): EnrolledEvent
  allEnrolledEvents: [EnrolledEvent]
  checkEnrolledEvent(eventId: ID!, userId: ID!): Boolean
  getEnrolledEventsByCreaterId(authorId: ID!): [EnrolledEvent]
}

type Mutation {
  enrollEvent(eventId: ID!, userId: ID!): EnrolledEvent
}

# type Subscription {}

type EnrolledEvent {
  id: ID!
  event: Event!
  eventId: ID!
  user: User!
  userId: ID!
  createdAt: String!
  updatedAt: String!
}

`;

export default EnrolledTypes;
