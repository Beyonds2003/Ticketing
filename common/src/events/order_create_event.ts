import { ChannelName } from "./channel_name";
import { OrderStatus } from "./types/orderStatus";

export interface OrderCreateEvent {
  subject: ChannelName.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    };
    version: number;
    userId: string;
  };
}
