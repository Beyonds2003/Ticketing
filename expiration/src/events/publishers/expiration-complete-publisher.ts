import {
  ChannelName,
  ExpirationCompleteEvent,
  Publisher,
} from "@nicole23_package/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  channel_name: ChannelName.ExpirationComplete = ChannelName.ExpirationComplete;
}
