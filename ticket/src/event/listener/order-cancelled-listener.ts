import {
  ChannelName,
  Listener,
  NotFoundError,
  OrderCancelEvent,
  OrderStatus,
} from "@nicole23_package/common";
import { queue_group_name } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket-model";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelEvent> {
  channel_name: ChannelName.OrderCancelled = ChannelName.OrderCancelled;

  queue_gruop_name: string = queue_group_name;

  async onMessage(data: OrderCancelEvent["data"], msg: Message) {
    const { id, status, version, ticket: newTicket } = data;

    const ticket = await Ticket.findById(newTicket.id);

    if (!ticket) throw new NotFoundError();

    ticket.set({
      orderId: undefined,
    });

    await ticket.save();

    // Publish an ticketUpdate event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
