import { ChannelName } from "./channel_name";

export interface ExpirationCompleteEvent {
  subject: ChannelName.ExpirationComplete;
  data: {
    orderId: string;
  };
}
