import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import createGraphQLServer from "../graphql";
import router from "./routes";

dotenv.config();

const port = Number(process.env.PORT) || 4000;
const env = process.env.NODE_ENV || "development";

export default async function graphQlServer(): Promise<void> {
  const app: Application = express();
  app.use(cors());
  app.use(express.json());

  if (env === "development") {
    app.use(require("morgan")("dev"));
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
  app.use("*", (_, _res: Response) => {
    throw new Error("Route not found");
  });

  app.use((err: Error, _: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({
      status: "error",
      statusCode: (err as any).statusCode || 500,
      message: err.message || "Internal Server Error",
    });
  });

  //   listen;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
