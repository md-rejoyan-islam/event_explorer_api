const EnrolledTypes = `#graphql 
type Query {
  getEnrolledEventById(id: ID!): EnrolledEvent
  allEnrolledEvents: [EnrolledEvent]
  checkEnrolledEvent(eventId: ID!, userId: ID!): Boolean
  getEnrolledEventsByCreaterId(authorId: ID!): [EnrolledEvent]
  getEnrolledEventsByUserId(userId: ID!): [EnrolledEvent]
  totalEnrolledEventsByEventId(eventId: ID!): Int
}

type Mutation {
  enrollEvent(eventId: ID!, userId: ID!): EnrolledEvent
  unenrollEvent(eventId: ID!, userId: ID!): EnrolledEvent
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
