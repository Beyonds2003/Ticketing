import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import cors from "cors";
import cookieSession from "cookie-session";
import { currentUser, NotFoundError } from "@nicole23_package/common";
import { errorHandler } from "@nicole23_package/common/build/middlewares/error-handler";
import mongoose, { ConnectOptions } from "mongoose";
import { getAllOrder } from "./routes/getAllOrder";
import { getOrderDetail } from "./routes/getOrderDetail";
import { createOrder } from "./routes/createOrder";
import { deleteOrder } from "./routes/deleteOrder";
import { natWrapper } from "./nat-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket_created_listener";
import { TicketUpdateListener } from "./events/listeners/ticket_update_listener";
import { Message } from "node-nats-streaming";
import { ExpirationCompleteListener } from "./events/listeners/expiration_complete_listener";
import { PaymentCreatedListener } from "./events/listeners/payment_created_listener";

const app = express();

app.set("trust proxy", true);

app.use(bodyParser.json());
app.use(cors({
  credentials: true,
}));
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);
app.use(currentUser);

// Route
app.use(createOrder);
app.use(getAllOrder);
app.use(getOrderDetail);
app.use(deleteOrder);

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

  try {
    await natWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natWrapper.client.on("close", () => process.exit());
    process.on("SIGINT", () => natWrapper.client.close());
    process.on("SIGTERM", () => natWrapper.client.close());

    new TicketCreatedListener(natWrapper.client).listen();
    new TicketUpdateListener(natWrapper.client).listen();
    new ExpirationCompleteListener(natWrapper.client).listen();
    new PaymentCreatedListener(natWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("success to connect database");
  } catch (error) {
    console.error(error);
  }

  app.listen(3003, () => {
    console.log(`Server is listening on port: 3003`);
  });
};

start();
