import { Cache } from "../Types/Cache";

/**
 * A class definition for the default cache.
 */
class DefaultCache implements Cache {
  private data: any = {};

  /**
   * Gives you an array of keys which can be filtered by a pattern.
   * @param pattern The pattern to find within the cache.
   */
  public keys(pattern: string) {
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
  public set(key: any, val) {
    return (this.data[key] = val);
  }

  /**
   * Removes a key from the cache.
   * Returns true if the data was successfully deleted from the cache.
   * @param key The key identifier.
   */
  public remove(key: any) {
    const res = !!this.data[key];
    delete this.data[key];

    return res;
  }

  /**
   * Fetches the value of the key in the cache.
   * @param key The key identifier.
   */
  public get(key: any) {
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
  public contains(key: any): boolean {
    return this.data.hasOwnProperty(key);
  }
}

export default DefaultCache;
