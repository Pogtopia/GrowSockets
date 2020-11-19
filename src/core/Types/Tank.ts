/**
 * Represents the data needed for the TankPacket.
 */
export interface Tank {
  type?: number;
  netID?: number;
  targetNetID?: number;
  state?: number;
  info?: number;
  xPos?: number;
  yPos?: number;
  xSpeed?: number;
  ySpeed?: number;
  xPunch?: number;
  yPunch?: number;
  data?: () => Buffer;
}
