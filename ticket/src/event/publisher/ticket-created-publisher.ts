import {
  ChannelName,
  Publisher,
  TicketCreateEvent,
} from "@nicole23_package/common";

export class TicketCreatedPublisher extends Publisher<TicketCreateEvent> {
  channel_name: ChannelName.TicketCreated = ChannelName.TicketCreated;
}
