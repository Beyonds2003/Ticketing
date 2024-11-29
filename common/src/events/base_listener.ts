import { Message, Stan } from "node-nats-streaming";
import { ChannelName } from "./channel_name";

interface Event {
  subject: ChannelName;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract channel_name: T["subject"];
  abstract queue_gruop_name: string;
  abstract onMessage(data: T["data"], msg: Message): void;

  protected ack_wait = 5 * 1000;
  protected client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ack_wait)
      .setDurableName(this.queue_gruop_name);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.channel_name,
      this.queue_gruop_name,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(
        `Message received: ${this.channel_name} / ${this.queue_gruop_name}`
      );

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
