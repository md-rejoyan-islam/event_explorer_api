import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Response } from "express";
import morgan from "morgan";
import createGraphQLServer from "../graphql";
import router from "./routes";

dotenv.config();

const port = Number(process.env.PORT) || 4000;
const env = process.env.NODE_ENV || "development";

export default async function graphQlServer(): Promise<void> {
  const app: Express = express();
  app.use(cors());
  app.use(express.json());

  if (env === "development") {
    app.use(morgan("dev"));
  }

  app.use(router);

  app.use(
    "/graphql",
    expressMiddleware(await createGraphQLServer(), {
      context: async ({ req }) => {
        const bearerToken = req.headers.authorization || "";
        const token = bearerToken?.split(" ")[1];

        return {
          token: token ?? "",
        };
      },
    })
  );

  // not found route
  app.use("*", (_, res: Response) => {
    res.status(404).json({
      status: "error",
      message: "Route not found",
    });
  });

  //   listen;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
