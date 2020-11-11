const native = require("../../native/build/Release/index.node");

/**
 * A simple wrapper for the native module.
 */

const Wrapper = {
  /**
   * Initiates the ENet Server.
   * @param port The port to use for the server.
   */
  init: (port: number): void => native.init(port),

  /**
   * Send packets to a specific peer id.
   * @param id The id of the peer.
   * @param count The amount of packets to send.
   * @param packets The packet to send. This is not an array, but it would be the rest of the arguments.
   */
  send: (id: number, count: number, ...packets: Buffer[]): void =>
    native.send(id, count, packets),

  /**
   * Accepts incoming data/connections by calling multiple "enet_host_service".
   */
  accept: () => {
    const acceptPromise = () =>
      new Promise((resolve) => setImmediate(() => resolve(native.accept())));

    const loop = async () => {
      while (true) await acceptPromise();
    };

    loop();
  },

  /**
   * Sets the netID to use. Only run this once, if not ran, it will start at 0.
   * @param netID The netID to set it to.
   */
  setNetID: (netID: number): void => native.setNetID(netID),

  /**
   * De-initializes ENet.
   */
  deInit: () => native.deInit(),

  /**
   * Set the emitter required by the server to emit events.
   */
  emitter: (emit: (...args: any[]) => any[]) => native.emitter(emit),

  /**
   * Native packet methods.
   */
  native: {
    /**
     * Send a text packet to the peer where packet creation is done natively.
     * @param netID The netID of the peer.
     * @param type The type of the text packet.
     * @param text The string associated with the packet.
     */
    text: (netID: number, type: number, text: string): void =>
      native.send_text_packet_native(netID, type, text),
  },
};

export default Wrapper;
