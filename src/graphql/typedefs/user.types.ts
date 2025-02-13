const UserType = `#graphql 
type Query {
  getUserById(id: ID!): User
  allUsers(page: Int, limit: Int): AllUserOutput
  me: User
  getUserByEmail(email:String!): User
  getAllAdmins: [User]
}

type Mutation {
  userRegister(registerData: userRegisterType!): User!
  userLogin(loginData: userLoginType!): Token!
  updateUserById(profileUpdate:ProfileUpdate! ): User!
  deleteUserById(id: ID!): User!
}

# type Subscription {}



type User {
  id: ID!
  name: String!
  email: String!
  password: String!
  role: Role!
  bio: String
  events: [Event]
  enrolledEvents: [EnrolledEvent]
  createdAt: String!
  updatedAt: String!
}

input userRegisterType {
  name: String!
  email: String!
  password: String!
  role: String!
}

input userLoginType {
  email: String!
  password: String!
  isAdmin: Boolean!
}

input ProfileUpdate {
  id: ID!
  name: String
  email: String
  password: String
  bio: String
  }

type Token {
  token: String!
}

type Paginations {
  totalItems: Int!
  totalPages: Int!
  currentPage: Int!
  perPage: Int!
  nextPage: Int
  previousPage: Int
}

type AllUserOutput {
  data: [User]
  pageInfo: Paginations
}

enum Role {
  ADMIN
  USER
}

`;

export default UserType;
