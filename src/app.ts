import cors from "cors";
import express, { Application, Request, Response } from "express";
import router from "./app/routes";
import cookieParser from 'cookie-parser';
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app: Application = express();

app.use(
  cors({
    origin: [
      "https://flatshare.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Assignment-09 Server working....!",
  });
});

//global error handler
//app.use(globalErrorHandler);

//handle not found
app.use(notFound);

export default app;
