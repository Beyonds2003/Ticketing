import { ChannelName } from "./channel_name";

export interface TicketUpdateEvent {
  subject: ChannelName.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
  };
}
