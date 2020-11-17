import Server from "./Server";
import Wrapper from "./Wrapper";

// types
import { Sendable } from "./Types/Sendable";
import { PeerData } from "./Types/PeerData";

class Peer {
  public data: PeerData;

  constructor(private server: Server, netID: number) {
    this.data = {
      netID,
    };
  }

  /**
   * Sends multiple packets to a single peer.
   * @param data An argument of packets that contains the `parse()` function or just an array of Buffers.
   */
  public send(...data: Sendable[]) {
    Peer.send(this.data.netID, ...data);
  }

  /**
   * Sends multiple packets to a single peer.
   * @param netID The netID of a peer.
   * @param data An argument of packets that contains the `parse()` function or just an array of Buffers.
   */
  public static send(netID: number, ...data: Sendable[]) {
    const packets = data.map((packet) => {
      if (Buffer.isBuffer(packet)) return packet;
      else if (typeof (packet as any).parse === "function")
        return packet.parse();
    });

    Wrapper.send(netID, packets.length, packets);
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
