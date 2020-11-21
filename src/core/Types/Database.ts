export interface Database {
  /**
   * Deletes a key from the database.
   * Returns false if it failed to delete. Otherwise, it succeeded.
   * @param key The unique key.
   */
  del: (key: any) => Promise<boolean>;

  /**
   * Fetches data from the database.
   * @param key The unique key.
   */
  get: <T>(key: any) => Promise<T>;

  /**
   * Sets or replace the key's data.
   * This function will return `false` if the file is still being written to by another `set` function.
   * It returns `true` if it has successfully written/overwrided the data of they key.
   * @param key The unique key.
   * @param data The data of the key.
   */
  set: (key: any, data: any) => Promise<any>;
}
