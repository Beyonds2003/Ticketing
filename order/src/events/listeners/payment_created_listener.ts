import {
  ChannelName,
  Listener,
  NotFoundError,
  OrderStatus,
  PaymentCreatedEvent,
} from "@nicole23_package/common";
import { queue_gruop_name } from "./ticket_created_listener";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order-model";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  channel_name: ChannelName.PaymentCreated = ChannelName.PaymentCreated;

  queue_gruop_name: string = queue_gruop_name;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const { id, orderId, stripeId } = data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    order.set({
      status: OrderStatus.Complete,
    });

    await order.save();

    msg.ack();
  }
}
