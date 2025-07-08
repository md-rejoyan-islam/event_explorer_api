# Event Management API

## 🚀 Overview

This project is a robust and scalable GraphQL API for an event management system. It provides a comprehensive set of features for both administrators and users to manage and interact with events. The API is built with a modern tech stack, ensuring high performance, type safety, and maintainability.

## ✨ Features

### 👤 User Features

- **View Events**: Browse and view all available events.
- **Enroll in Events**: Authenticated users can enroll in events they are interested in.
- **Unenroll from Events**: Users can unenroll from events they have previously enrolled in.
- **View Enrolled Events**: Users can view a list of all events they are currently enrolled in.
- **Authentication**: Secure user registration and login with JWT-based authentication.

### 👑 Admin Features

- **Event Management**: Admins have full CRUD (Create, Read, Update, Delete) capabilities for events.
- **User Management**: Admins can view all registered users.
- **View Enrolled Users**: Admins can see all users enrolled in a specific event.
- **Seed Data**: Admins can seed the database with initial data for users, events, and enrollments.

## 🛠️ Tech Stack

This project leverages a modern and powerful technology stack:

- **[Node.js](https://nodejs.org/)**: A JavaScript runtime for building fast and scalable server-side applications.
- **[Express.js](https://expressjs.com/)**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **[Apollo Server](https://www.apollographql.com/docs/apollo-server/)**: A community-maintained open-source GraphQL server that works with many Node.js HTTP server frameworks.
- **[GraphQL](https://graphql.org/)**: A query language for your API, and a server-side runtime for executing queries by using a type system you define for your data.
- **[Prisma](https://www.prisma.io/)**: A next-generation ORM for Node.js and TypeScript. It helps you read and write data to your database in an intuitive and safe way.
- **[TypeScript](https://www.typescriptlang.org/)**: A typed superset of JavaScript that compiles to plain JavaScript.
- **[MongoDB](https://www.mongodb.com/)**: A general-purpose, document-based, distributed database built for modern application developers and for the cloud era.
- **[JSON Web Token (JWT)](https://jwt.io/)**: A compact, URL-safe means of representing claims to be transferred between two parties.
- **[Bcrypt.js](https://www.npmjs.com/package/bcryptjs)**: A library for hashing passwords.

## 📦 Packages Used

### Dependencies

- **`@apollo/server`**: The core Apollo Server library for creating a GraphQL server.
- **`@prisma/client`**: The Prisma Client for interacting with the database.
- **`bcryptjs`**: For hashing and comparing passwords.
- **`cors`**: For enabling Cross-Origin Resource Sharing.
- **`dotenv`**: For loading environment variables from a `.env` file.
- **`express`**: The web application framework.
- **`graphql`**: The JavaScript implementation of GraphQL.
- **`graphql-tools`**: For building and maintaining GraphQL schemas.
- **`http-errors`**: For creating HTTP errors.
- **`jsonwebtoken`**: For creating and verifying JSON Web Tokens.
- **`tsc-watch`**: For watching TypeScript files and recompiling on changes.

### Dev Dependencies

- **`@types/*`**: Type definitions for various packages.
- **`morgan`**: For logging HTTP requests.
- **`nodemon`**: For automatically restarting the server on file changes.
- **`prisma`**: The Prisma CLI for managing the database schema.
- **`ts-node`**: For running TypeScript files directly.
- **`typescript`**: The TypeScript compiler.

## 📂 Project Structure

The project is structured to be modular and maintainable:

```
├───.dockerignore
├───.gitignore
├───Dockerfile
├───package-lock.json
├───package.json
├───README.md
├───tsconfig.json
├───data/
│   ├───enrolled.json
│   ├───events.json
│   └───users.json
├───prisma/
│   └───schema.prisma
└───src/
    ├───server.ts
    ├───app/
    │   ├───app.ts
    │   └───routes.ts
    ├───config/
    │   └───cors.ts
    ├───graphql/
    │   ├───index.ts
    │   ├───resolvers/
    │   │   ├───enrolled.resolver.ts
    │   │   ├───event.resolver.ts
    │   │   ├───index.ts
    │   │   ├───message.resolver.ts
    │   │   ├───seed.resolver.ts
    │   │   └───user.resolver.ts
    │   └───typedefs/
    │       ├───enrolled.types.ts
    │       ├───event.types.ts
    │       ├───index.ts
    │       ├───message.types.ts
    │       ├───seed.types.ts
    │       └───user.types.ts
    ├───middlewares/
    │   ├───isAdmin.middleware.ts
    │   └───isAuthenticated.middleware.ts
    ├───services/
    │   ├───enrolled-event.service.ts
    │   ├───event.service.ts
    │   ├───message.service.ts
    │   ├───seed.service.ts
    │   └───user.service.ts
    └───utils/
        ├───hash-password.ts
        ├───jwt.ts
        ├───mongodb-object-id.ts
        ├───prisma-client.ts
        └───types.ts
```

- **`data/`**: Contains JSON files for seeding the database.
- **`prisma/`**: Contains the Prisma schema file (`schema.prisma`) which defines the database models.
- **`src/`**: The main source code directory.
  - **`app/`**: Contains the Express application setup and routes.
  - **`config/`**: Configuration files, such as CORS settings.
  - **`graphql/`**: Contains the GraphQL schema, resolvers, and type definitions.
    - **`resolvers/`**: Resolvers for each GraphQL type.
    - **`typedefs/`**: GraphQL type definitions.
  - **`middlewares/`**: Custom middlewares for authentication and authorization.
  - **`services/`**: Business logic for interacting with the database.
  - **`utils/`**: Utility functions for hashing passwords, JWT, etc.
- **`Dockerfile`**: For containerizing the application.
- **`package.json`**: Lists the project dependencies and scripts.
- **`tsconfig.json`**: TypeScript compiler options.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/md-rejoyan-islam/event_explorer_api.git
   cd event-full/server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root of the `server` directory and add the following:

   ```
   DATABASE_URL="your-mongodb-connection-string"
   JWT_SECRET="your-jwt-secret"
   ```

4. **Generate Prisma Client:**

   ```bash
   npx prisma generate
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

The server will be running at `http://localhost:4000`.

## API Endpoints

The GraphQL API is available at `http://localhost:4000/graphql`. You can use a GraphQL client like [Apollo Studio Sandbox](https://studio.apollographql.com/sandbox) to interact with the API.

### Example Queries and Mutations

You can find detailed examples of GraphQL queries and mutations in the original `README.md` file.

## 🐳 Docker

This project includes a `Dockerfile` for easy containerization.

1. **Build the Docker image:**

   ```bash
   docker build -t event-full-server .
   ```

2. **Run the Docker container:**

   ```bash
   docker run -p 4000:4000 -e DATABASE_URL="your-mongodb-connection-string" -e JWT_SECRET="your-jwt-secret" event-full-server
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## Links

- [Client Repository](https://github.com/md-rejoyan-islam/event_explorer_client)
- [Website Live Demo](https://event-explorer.vercel.app)
- [API Demo](https://ministerial-gabriel-rejoyan-cd2987cb.koyeb.app/graphql)

## Contact

For questions or suggestions, feel free to reach out:

- **Name**: Md Rejoyan Islam
- **Email**: [rejoyanislam0014@gmail.com](mailto:rejoyanislam0014@gmail.com)
- **LinkedIn**: [https://www.linkedin.com/in/md-rejoyan-islam/](https://www.linkedin.com/in/md-rejoyan-islam/)
- **Portfolio**: [https://md-rejoyan-islam.github.io](https://md-rejoyan-islam.github.io)
