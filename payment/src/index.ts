import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import cors from "cors";
import cookieSession from "cookie-session";
import { currentUser, NotFoundError } from "@nicole23_package/common";
import { errorHandler } from "@nicole23_package/common/build/middlewares/error-handler";
import mongoose, { ConnectOptions } from "mongoose";
import { natWrapper } from "./nat-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { chargePayment } from "./routes/chargePayment";

const app = express();

app.set("trust proxy", true);

app.use(bodyParser.json());
app.use(cors());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);
app.use(currentUser);

// Route
app.use(chargePayment);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("Something went wrong with JWT_KEY");
  }

  if (!process.env.MONGO_URL) {
    throw new Error("Database connection error with ticket!");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("Nats cluster id connection error with ticket!");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("Nats client id connection error with ticket!");
  }

  if (!process.env.NATS_URL) {
    throw new Error("Nats url connection error with ticket!");
  }

  if (!process.env.STRIPE_KEY) {
    throw new Error("STRIPE_KEY connection error with ticket!");
  }

  try {
    await natWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    new OrderCreatedListener(natWrapper.client).listen();
    new OrderCancelledListener(natWrapper.client).listen();

    natWrapper.client.on("close", () => process.exit());
    process.on("SIGINT", () => natWrapper.client.close());
    process.on("SIGTERM", () => natWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("success to connect database");
  } catch (error) {
    console.error(error);
  }

  app.listen(3004, () => {
    console.log(`Server is listening on port: 3004`);
  });
};

start();
