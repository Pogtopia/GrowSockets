/**
 * Options for the http server.
 */
export interface HTTPOptions {
  /**
   * Whether or not to use the built-in HTTP Server. Defaults to `false`
   */
  enabled?: boolean;

  /**
   * The port of the server. Defaults to `17091`
   */
  serverPort?: number;

  /**
   * The ip of the server. Defaults to `127.0.0.1`
   */
  serverIP?: string;
}

/**
 * The configuration for the server.
 */
export interface Config {
  /**
   * The port to use for the server. Defaults to `17091`
   */
  port?: number;

  /**
   * The options for the HTTP server.
   */
  http?: HTTPOptions;
}
