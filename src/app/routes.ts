import express, { Response } from "express";

const router = express.Router();

// home route
router.get("/", (_, res: Response) => {
  res.json({
    status: "success",
    message: "Welcome to the GraphQL API",
  });
});

// health route
router.use("/health", (_, res: Response) => {
  res.json({
    status: "success",
    message: "Server is running",
  });
});

export default router;
