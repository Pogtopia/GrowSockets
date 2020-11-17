/**
 * A class definition for the default cache.
 */
class DefaultCache {
  private data: any = {};

  /**
   * Gives you an array of keys which can be filtered by a pattern.
   * @param pattern The pattern to find within the cache.
   */
  keys(pattern: string) {
    pattern = pattern.replace(new RegExp("\\*", "g"), "\\w*?");

    return Object.keys(this.data).filter((key) =>
      key.match(new RegExp(pattern, "g"))
    );
  }

  /**
   * Sets a key value pair or replaces one in the cache.
   * @param key They key identifier.
   * @param val The value the key is associated with.
   */
  set(key: string, val) {
    return (this.data[key] = val);
  }

  /**
   * Removes a key from the cache.
   * @param key The key identifier.
   */
  remove(key: string) {
    return delete this.data[key];
  }

  /**
   * Fetches the value of the key in the cache.
   * @param key The key identifier.
   */
  get(key: string) {
    const data = this.data[key];
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  /**
   * Checks whether or not a key exists in the cache.
   * @param key The key indentifier.
   */
  contains(key: string): boolean {
    return this.data.hasOwnProperty(key);
  }
}

export default DefaultCache;
