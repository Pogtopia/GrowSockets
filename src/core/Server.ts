import { EventEmitter } from "events";
import Wrapper from "./Wrapper";
import Http from "./Http";
import DefaultCache from "./Cache/Default";
import DefaultDb from "./Database/Default";

// Types
import { Config } from "./Types/Config";

/**
 * A class that represents the Server.
 */
class Server<A, B, C> extends EventEmitter {
  private port: number;

  /**
   * Cache object that contains functions to manipulate the cache.
   */
  public cache: A;

  /**
   * Database object that contains functions to manipulate the Database.
   */
  public db: B;

  /**
   * Server internal data, use this to store anything you want.
   */
  public data: C;

  constructor(config?: Config<A, B>) {
    super();

    if (!config)
      config = {
        port: 17091,
        http: {},
        cache: new DefaultCache() as any,
        db: new DefaultDb() as any,
        usingNewPacket: false,
      };

    if (config.usingNewPacket) Wrapper.useNewPacket();

    if (config.http?.enabled) {
      this.log("HTTP Server Started.");
      Http(
        config.http.serverPort || 17091,
        config.http.serverIP || "127.0.0.1"
      );
    }

    this.cache = config.cache;
    this.db = config.db;
    this.port = config.port ?? 17091;
  }

  /**
   * Listens for the `connect` event.
   * @param event The type of the event.
   * @param listener The callback to execute if the event is emitted.
   */
  public on(event: "connect", listener: (netID: number) => void): this;

  /**
   * Listens for the `data` event.
   * @param event The type of the event.
   * @param listener The callback to execute if the event is emitted.
   */
  public on(
    event: "data",
    listener: (netID: number, data: Buffer) => void
  ): this;

  /**
   * Listens for the `disconnect` event.
   * @param event The type of the event.
   * @param listener The callback to execute if the event is emitted.
   */
  public on(event: "disconnect", listener: (netID: number) => void): this;

  /**
   * Listens for the specified event event.
   * @param event The type of the event.
   * @param listener The callback to execute if the event is emitted.
   */
  public on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  /**
   * Logs something to the console asynchronously and with a format
   * @param args Same arguments to pass when using `console.log`
   */
  public async log(...args: any[]): Promise<void> {
    return new Promise((resolve) => {
      const date = new Date();

      resolve(
        console.log(
          `[${date.toDateString()} ${date.toLocaleTimeString()}] |`,
          ...args
        )
      );
    });
  }

  /**
   * Starts listening to the port to start the ENet Server.
   */
  public listen() {
    const port = this.port || 17091;

    Wrapper.init(port);
    this.log("ENet Server now initiated on port.", port);

    Wrapper.emitter(this.emit.bind(this));
    this.log("Event Emitter function has now been set.");

    Wrapper.accept();
    this.log("Now acknowledging events.");
  }
}

export default Server;
