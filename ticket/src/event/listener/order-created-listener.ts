import {
  ChannelName,
  Listener,
  NotFoundError,
  OrderCreateEvent,
  OrderStatus,
} from "@nicole23_package/common";
import { queue_group_name } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket-model";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreateEvent> {
  channel_name: ChannelName.OrderCreated = ChannelName.OrderCreated;

  queue_gruop_name: string = queue_group_name;

  async onMessage(data: OrderCreateEvent["data"], msg: Message) {
    const { id, status, expiresAt, version, ticket: newTicket } = data;

    // Find the ticket and add orderId to block update
    const ticket = await Ticket.findById(newTicket.id);

    if (!ticket) throw new NotFoundError();

    ticket.set({
      orderId: id,
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
