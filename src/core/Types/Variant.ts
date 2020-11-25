/**
 * The argument type for the variant.
 */
export type Arg = string | number[] | number;

/**
 * Types for each Argument.
 */
export enum ArgType {
  NONE,
  STRING = 0x2,
  SIGNED_INT = 0x5,
  UNSIGNED_INT = 0x9,
}

/**
 * Options for the Variant Packet
 */
export interface Options {
  /**
   * The netID of the variant.
   */
  netID?: number;

  /**
   * They delay (in ms) on when the client will execute the packet.
   */
  delay?: number;
}
