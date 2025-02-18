# Event Handler API

This is an Event Handler API built using **Express**, **GraphQL**, and **Apollo Server**, with **Prisma** as the ORM and **MongoDB** as the database. It allows admins to create, update, and delete events, while users can view all events, enroll in events, unenroll, and view their enrolled events if authenticated.

## Features

### Admin

- **Create Event**: Admins can create new events with relevant details.
- **Update Event**: Admins can update existing event information.
- **Delete Event**: Admins can delete events at any time.
- **View All Events**: Admins can view all available events.
- **View Enrolled Users**: Admins can view all users enrolled in a specific event.

### User

- **View All Events**: All users can view all available events.
- **Enroll in Event**: Authenticated users can enroll in events.
- **Unenroll from Event**: Authenticated users can unenroll from events they have enrolled in.
- **View Enrolled Events**: Authenticated users can view events they are enrolled in.

## Tech Stack

- **Node.js** with **Express** for server-side logic.
- **GraphQL** with **Apollo Server** for the API.
- **Prisma** as the ORM for data modeling and database communication.
- **MongoDB** as the database.
- **JWT** for authentication.
- **bcrypt** for password hashing.

## GraphQL Endpoints

### Admin

- **Create Event**:

  ```graphql
  mutation {
    createEvent(
      input: {
        title: "Event Title"
        description: "Event Description"
        date: "Event Date"
      }
    ) {
      id
      title
    }
  }
  ```

- **Update Event**:

  ```graphql
  mutation {
    updateEvent(eventId: "event_id", input: { title: "Updated Title" }) {
      id
      title
    }
  }
  ```

- **Delete Event**:

  ```graphql
  mutation {
    deleteEvent(eventId: "event_id") {
      message
    }
  }
  ```

- **View All Events**:

  ```graphql
  query {
    events {
      id
      title
      description
      date
    }
  }
  ```

- **View Enrolled Users**:
  ````graphql
      query {
          enrolledUsers(eventId: "event_id") {
          id
          name
          email
          }
      }
      ```
  ````

### User

- **View All Events**:

  ```graphql
  query {
    events {
      id
      title
      description
      date
    }
  }
  ```

- **Enroll in Event**:

  ```graphql
  mutation {
    enroll(eventId: "event_id") {
      message
    }
  }
  ```

- **Unenroll from Event**:

  ```graphql
  mutation {
    unenroll(eventId: "event_id") {
      message
    }
  }
  ```

- **View Enrolled Events**:
  ```graphql
  query {
    myEnrolledEvents {
      id
      title
      date
    }
  }
  ```

---

## Authentication

- **JWT** is used for authentication.
- Token is required in the `Authorization` header for the following actions:
  - Enroll in Event
  - Unenroll from Event
  - View Enrolled Events

## Links

[Client Repository](https://github.com/md-rejoyan-islam/event_explorer_client)

[Website Live Demo](https://event-explorer.vercel.app)

[API Demo](https://ministerial-gabriel-rejoyan-cd2987cb.koyeb.app/graphql)

## Contact

For questions or suggestions, feel free to reach out:

- **Name**: Md Rejoyan Islam
- **Email**: [rejoyanislam0014@gmail.com]
- **LinkedIn**: [https://www.linkedin.com/in/md-rejoyan-islam/]
