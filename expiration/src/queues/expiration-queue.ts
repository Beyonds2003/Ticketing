import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natWrapper } from "../nat-wrapper";

interface Payload {
  orderId: string;
}

export const expirationQueue = new Queue<Payload>("order_expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log(`Event from expiration queue and value is ${job.data.orderId}`);

  await new ExpirationCompletePublisher(natWrapper.client).publish({
    orderId: job.data.orderId,
  });
});
