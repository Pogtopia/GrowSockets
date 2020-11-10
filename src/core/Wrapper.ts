const native = require("../native/build/Release/index.node");

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
};

export default Wrapper;
