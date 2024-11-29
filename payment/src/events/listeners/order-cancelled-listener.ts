import {
  ChannelName,
  Listener,
  NotFoundError,
  OrderCancelEvent,
  OrderStatus,
} from "@nicole23_package/common";
import { queue_group_name } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order-model";

export class OrderCancelledListener extends Listener<OrderCancelEvent> {
  channel_name: ChannelName.OrderCancelled = ChannelName.OrderCancelled;

  queue_gruop_name: string = queue_group_name;

  async onMessage(data: OrderCancelEvent["data"], msg: Message) {
    const { id, status, version, userId, ticket: newTicket } = data;

    const order = await Order.findOne({
      _id: id,
      version: version - 1,
    });

    if (!order) {
      throw new NotFoundError();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    msg.ack();
  }
}
