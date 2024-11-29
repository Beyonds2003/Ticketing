import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import cors from "cors";
import { currentUserRoute } from "./route/current-user";
import { signinRoute } from "./route/signin";
import { signoutRoute } from "./route/signout";
import { signupRoute } from "./route/signup";
import { errorHandler, NotFoundError } from "@nicole23_package/common";
import mongoose, { ConnectOptions } from "mongoose";
import cookieSession from "cookie-session";

const app = express();

app.set("trust proxy", true);

app.use(bodyParser.json());
app.use(cors());
app.use(
  cookieSession({
    signed: false, // don't encrypt cookie
    secure: true, // allow https endpoint
  }),
);

// Route
app.use(currentUserRoute);
app.use(signinRoute);
app.use(signoutRoute);
app.use(signupRoute);

app.get("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("Something went wrong with JWT_KEY");
  }

  if (!process.env.MONGO_URL) {
    throw new Error("Database connection error with auth!");
  }

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("success to connect database");
  } catch (error) {
    console.error(error);
  }
  app.listen(3001, () => {
    console.log(`Server is listening on port: 3001 cors`);
  });
};

start();
