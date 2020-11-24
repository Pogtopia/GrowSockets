import Server from "./Server";
import Wrapper from "./Wrapper";
import Variant from "./Packets/Variant";

// types
import { Sendable } from "./Types/Sendable";
//import { PeerData } from "./Types/PeerData";

class Peer<T> {
  public data: T;

  constructor(public server: Server<any, any, any>, netID: number) {
    (this.data as any) = {
      netID,
    };
  }

  /**
   * Fetches peer data from the cache (uses the netID)
   */
  public async getDataFromCache() {
    const data = await this.server.cache.get(`player_${(this.data as any).netID}`);
    if (data) this.data = data;
  }

  /**
   * Sets the user data in cache.
   */
  public async setDataToCache() {
    return await this.server.cache.set(`player_${(this.data as any).netID}`, this.data);
  }

  /**
   * Gets the data of the peer with the rid.
   * @param rid The rid of the peer
   */
  public async getDataFromDatabase(rid?: string) {
    if (!rid) rid = (this.data as any).rid;
    const data = await this.server.db.get(`player_${rid}`);

    if (data) {
      data.netID = (this.data as any).netID;
      this.data = data;
    }
  }

  /**
   * Sets the data of the user to the database.
   * @param rid The rid of the peer
   */
  public async setDataToDatabase(rid?: string) {
    if (!rid) rid = (this.data as any).rid;
    this.server.db.set(`player_${rid}`, this.data);
  }

  /**
   * Sends multiple packets to a single peer.
   * @param data An argument of packets that contains the `parse()` function or just an array of Buffers.
   */
  public send(...data: Sendable[]) {
    Peer.send((this.data as any).netID, ...data);
  }

  /**
   * Sends multiple packets to a single peer.
   * @param netID The netID of a peer.
   * @param data An argument of packets that contains the `parse()` function or just an array of Buffers.
   */
  public static send(netID: number, ...data: Sendable[]) {
    const packets = data.map((packet) => {
      if (Buffer.isBuffer(packet)) return packet;
      else {
        switch (packet.constructor.name) {
          case "TextPacket":
          case "TankPacket": {
            return packet.parse();
          }

          case "Variant": {
            return (packet as Variant).parse().parse();
          }

          default: {
            break;
          }
        }
      }
    });

    Wrapper.send(netID, packets.length, packets as any[]);
  }

  /**
   * Creates a new instance of the Peer class.
   * @param server The server object.
   * @param netID The netID of the peer
   */
  public static new(server, netID) {
    return new Peer(server, netID);
  }
}

export default Peer;
