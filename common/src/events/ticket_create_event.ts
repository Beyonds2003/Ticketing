import { ChannelName } from "./channel_name";

export interface TicketCreateEvent {
  subject: ChannelName.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
  };
}
