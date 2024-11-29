import {
  ChannelName,
  TicketCreateEvent,
  Listener,
} from "@nicole23_package/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket-model";

export const queue_gruop_name: string = "order_service"; // *** Avoid using ":" in the value. example: "order:service"

export class TicketCreatedListener extends Listener<TicketCreateEvent> {
  channel_name: ChannelName.TicketCreated = ChannelName.TicketCreated;

  queue_gruop_name: string = queue_gruop_name;

  async onMessage(data: TicketCreateEvent["data"], msg: Message) {
    const { id, title, price, userId } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}
