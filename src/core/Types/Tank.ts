export interface Tank {
  type?: number;
  netID?: number;
  targetNetID?: number;
  state?: number; // 16
  info?: number; // 24
  xPos?: number; // 28
  yPos?: number; // 32
  xSpeed?: number; // 36
  ySpeed?: number; // 40
  xPunch?: number; // 48
  yPunch?: number; // 52
  data?: () => Buffer; // 56 for len, 60 for data
}
