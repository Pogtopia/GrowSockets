/**
 * Methods required for the cache manager.
 */
export interface Cache {
  /**
   * Gives you an array of keys which can be filtered by a pattern.
   * @param pattern The pattern to find within the cache.
   */
  keys: (pattern: string) => string[];

  /**
   * Sets a key value pair or replaces one in the cache.
   * @param key They key identifier.
   * @param val The value the key is associated with.
   */
  set: (key: any, val) => any;

  /**
   * Removes a key from the cache.
   * @param key The key identifier.
   */
  remove: (key: any) => boolean;

  /**
   * Fetches the value of the key in the cache.
   * @param key The key identifier.
   */
  get: (key: any) => any;
  /**
   * Checks whether or not a key exists in the cache.
   * @param key The key indentifier.
   */
  contains: (key: any) => boolean;
}
