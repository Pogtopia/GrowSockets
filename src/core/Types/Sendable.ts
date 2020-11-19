import TankPacket from "../Packets/TankPacket";
import TextPacket from "../Packets/TextPacket";
import Variant from "../Packets/Variant";

/**
 * Represents the available type of Objects that are sendable to peers.
 */
export type Sendable = Buffer | TextPacket | TankPacket | Variant;
