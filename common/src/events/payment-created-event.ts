import { ChannelName } from "./channel_name";

export interface PaymentCreatedEvent {
  subject: ChannelName.PaymentCreated;
  data: {
    id: string;
    stripeId: string;
    orderId: string;
  };
}
