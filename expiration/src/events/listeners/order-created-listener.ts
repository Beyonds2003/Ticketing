import {
  ChannelName,
  Listener,
  OrderCreateEvent,
  OrderStatus,
} from "@nicole23_package/common";
import { queue_gruop_name } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreateEvent> {
  channel_name: ChannelName.OrderCreated = ChannelName.OrderCreated;

  queue_gruop_name: string = queue_gruop_name;

  async onMessage(data: OrderCreateEvent["data"], msg: Message) {
    const { id, status, expiresAt, ticket: newTicket, version } = data;

    const date = new Date(expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add(
      {
        orderId: id,
      },
      {
        delay: date,
      }
    );

    msg.ack();
  }
}
