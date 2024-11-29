import { Stan } from "node-nats-streaming";
import nat from "node-nats-streaming";

class NatWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Nat client is undefined");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nat.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this._client?.on("connect", () => {
        console.log("Connected to Nat");
        resolve();
      });
      this._client?.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natWrapper = new NatWrapper();
