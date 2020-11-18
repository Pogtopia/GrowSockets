import { Tank } from "../Types/Tank";

const TANK_HEADER_SIZE = 60;

/**
 * A class to represent a TankPacket.
 */
class TankPacket {
  /**
   * Creates a new instance of the TankPacket class.
   * @param data The tankpacket header and data.
   */
  constructor(public data?: Tank) {}

  /**
   * Creates a new instance of the TankPacket class.
   * @param data TankPacket header and data.
   */
  public static from(data: Tank) {
    return new TankPacket(data);
  }

  /**
   * Converts the TankPacket class to a Buffer
   */
  public parse() {
    if (!this.data) return;
    let buf = Buffer.alloc(TANK_HEADER_SIZE);

    buf.writeUInt32LE(0x4);
    buf.writeUInt32LE(this.data.type ?? 0, 4);
    buf.writeInt32LE(this.data.netID ?? 0, 8);
    buf.writeInt32LE(this.data.targetNetID ?? 0, 12);
    buf.writeUInt32LE(this.data.state ?? 0x8, 16);
    buf.writeUInt32LE(this.data.info ?? 0, 24);
    buf.writeFloatLE(this.data.xPos ?? 0, 28);
    buf.writeFloatLE(this.data.yPos ?? 0, 32);
    buf.writeFloatLE(this.data.xSpeed ?? 0, 36);
    buf.writeFloatLE(this.data.ySpeed ?? 0, 40);
    buf.writeInt32LE(this.data.xPunch ?? 0, 48);
    buf.writeInt32LE(this.data.yPunch ?? 0, 52);

    if (typeof this.data.data === "function") {
      const extra = this.data.data();
      if (!Buffer.isBuffer(extra)) return;

      buf.writeUInt32LE(extra.length, 56);
      buf = Buffer.concat([buf, extra]);
    }

    return buf;
  }
}

export default TankPacket;
