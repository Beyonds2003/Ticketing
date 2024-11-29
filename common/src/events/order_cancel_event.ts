import { ChannelName } from "./channel_name";
import { OrderStatus } from "./types/orderStatus";

export interface OrderCancelEvent {
  subject: ChannelName.OrderCancelled;
  data: {
    id: string;
    status: OrderStatus;
    ticket: {
      id: string;
    };
    version: number;
    userId: string;
  };
}
