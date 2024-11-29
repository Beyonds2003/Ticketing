import {
  ChannelName,
  OrderCreateEvent,
  Publisher,
} from "@nicole23_package/common";

export class OrderCreatedPublisher extends Publisher<OrderCreateEvent> {
  channel_name: ChannelName.OrderCreated = ChannelName.OrderCreated;
}
