import {
  ChannelName,
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
} from "@nicole23_package/common";
import { queue_gruop_name } from "./ticket_created_listener";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order-model";
import { OrderCancelledPublisher } from "../publishers/order_cancelled_publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  channel_name: ChannelName.ExpirationComplete = ChannelName.ExpirationComplete;

  queue_gruop_name: string = queue_gruop_name;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const { orderId } = data;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      status: order.status,
      ticket: { id: order.ticket.id },
      version: order.version,
      userId: order.userId,
    });

    msg.ack();
  }
}
