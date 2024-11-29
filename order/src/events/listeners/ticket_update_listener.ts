import {
  ChannelName,
  Listener,
  NotFoundError,
  TicketUpdateEvent,
} from "@nicole23_package/common";
import { queue_gruop_name } from "./ticket_created_listener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket-model";

export class TicketUpdateListener extends Listener<TicketUpdateEvent> {
  channel_name: ChannelName.TicketUpdated = ChannelName.TicketUpdated;

  queue_gruop_name: string = queue_gruop_name;

  async onMessage(data: TicketUpdateEvent["data"], msg: Message) {
    const { id, title, price, userId, version } = data;

    let ticket = await Ticket.findOne({
      _id: id,
      version: version - 1,
    });

    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set({
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}
