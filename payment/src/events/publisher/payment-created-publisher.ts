import {
  ChannelName,
  PaymentCreatedEvent,
  Publisher,
} from "@nicole23_package/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  channel_name: ChannelName.PaymentCreated = ChannelName.PaymentCreated;
}
