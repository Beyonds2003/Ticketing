import { natWrapper } from "./nat-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
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

    new OrderCreatedListener(natWrapper.client).listen();

    natWrapper.client.on("close", () => process.exit());
    process.on("SIGINT", () => natWrapper.client.close());
    process.on("SIGTERM", () => natWrapper.client.close());
  } catch (error) {
    console.error(error);
  }
};

start();
