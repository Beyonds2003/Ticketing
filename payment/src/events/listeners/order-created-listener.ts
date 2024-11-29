import {
  ChannelName,
  Listener,
  OrderCreateEvent,
  OrderStatus,
} from "@nicole23_package/common";
import { queue_group_name } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order-model";

export class OrderCreatedListener extends Listener<OrderCreateEvent> {
  channel_name: ChannelName.OrderCreated = ChannelName.OrderCreated;

  queue_gruop_name: string = queue_group_name;

  async onMessage(data: OrderCreateEvent["data"], msg: Message) {
    const { id, status, expiresAt, version, ticket: newTicket, userId } = data;

    const order = Order.build({
      id,
      status,
      version,
      userId,
      price: newTicket.price,
    });

    await order.save();

    msg.ack();
  }
}
