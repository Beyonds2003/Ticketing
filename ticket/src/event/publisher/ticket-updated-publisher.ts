import {
  ChannelName,
  Publisher,
  TicketUpdateEvent,
} from "@nicole23_package/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdateEvent> {
  channel_name: ChannelName.TicketUpdated = ChannelName.TicketUpdated;
}
