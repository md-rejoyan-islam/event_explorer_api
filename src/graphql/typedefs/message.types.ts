const messageType = `#graphql

  type Query {
    getAllMessages: [Message]
    getAllMessagesByUserId(userId: ID!): [Message]
  }

  type Mutation {
    createMessage(messageData: messageCreate!): Message!
    updateMessageById(updateData: updateMessage!): Message!
    deleteMessageById(id: ID!): Message!
  }

  type Message {
    id: ID!
    message: String!
    sender: User
    senderId: ID!
    createdAt: String!
    updatedAt: String!
  }

  input messageCreate {
    message: String!
    senderId: ID!
  }

    input updateMessage {
        id: ID!
        message: String
    }

`;

export default messageType;
