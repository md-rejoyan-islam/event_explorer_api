const EventType = `#graphql 

type Query {
  getEventById(id: ID!): Event
  allEvents(page: Int, limit: Int,search:String,category:String): AllEventOutput
  allEventsCategory: allEventsCategoryOutput
}

type Mutation {
  createEvent(eventData: eventCreate!): Event!
  updateEventById(
    id: ID!
    title: String
    date: String
    time: String
    location: String
    category: String
    description: String
    image: String
    price: String
    capacity: Int
    organizer: String
    additionalInfo: [String]
    status: String
  ): Event!
  deleteEventById(id: ID!): Event!
}

# type Subscription {}

type Event {
  id: ID!
  title: String!
  date: String!
  time: String!
  location: String!
  category: String!
  description: String!
  image: String!
  price: String!
  capacity: Int!
  organizer: User
  authorId: ID!
  additionalInfo: [String]
  status: String!
  createdAt: String!
  updatedAt: String!
}

input eventCreate {
  title: String!
  date: String!
  time: String!
  location: String!
  category: String!
  description: String!
  image: String!
  price: Float!
  capacity: Int!
  authorId: ID!
  additionalInfo: [String]
  status: String
}

type Paginations {
  totalItems: Int!
  totalPages: Int!
  currentPage: Int!
  perPage: Int!
  nextPage: Int
  previousPage: Int
}

type AllEventOutput {
  data: [Event]
  pageInfo: Paginations
}

type allEventsCategoryOutput {
  data: [String]
}


`;

export default EventType;
