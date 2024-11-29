import {
  ChannelName,
  OrderCancelEvent,
  Publisher,
} from "@nicole23_package/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelEvent> {
  channel_name: ChannelName.OrderCancelled = ChannelName.OrderCancelled;
}
