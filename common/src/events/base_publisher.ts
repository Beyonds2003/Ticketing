import { Stan } from "node-nats-streaming";
import { ChannelName } from "./channel_name";

interface Event {
  subject: ChannelName;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract channel_name: T["subject"];
  protected client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.channel_name, JSON.stringify(data), (err) => {
        if (err) {
          reject(err);
        }
        console.log(
          `Event publish to ${this.channel_name} and data is ${data}`
        );
        resolve();
      });
    });
  }
}
