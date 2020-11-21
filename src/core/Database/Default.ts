import { readFile, writeFile, unlink } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import * as zlib from "zlib";

// Types
import { Database } from "../Types/Database";

// Constants
const DATA_DIR = `${__dirname}/data`;

/**
 * The class for the default database which uses fs.
 */
class DefaultDb implements Database {
  private cache = {};

  constructor(saveInterval: number = 60 * 30 * 1000) {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR);
    setInterval(() => {
      this.save();
    }, saveInterval); // save every 30 mins
  }

  private async save() {
    const keys = Object.keys(this.cache);

    keys.forEach((key) => {
      let data = this.cache[key];
      if (typeof data === "object") data = JSON.stringify(data);

      data = zlib.deflateSync(data, {
        level: zlib.constants.Z_BEST_COMPRESSION,
      });

      writeFile(`${DATA_DIR}/${key}.dat`, data);
      delete this.cache[key];
    });
  }

  /**
   * Deletes a key from the database.
   * Returns false if it failed to delete. Otherwise, it succeeded.
   * @param key The unique key.
   */
  public async del(key: any) {
    await unlink(`${DATA_DIR}/${key}.dat`).catch((_) => {});

    const res = !!this.cache[key];
    delete this.cache[key];

    return res;
  }

  /**
   * Fetches data from the database.
   * @param key The unique key.
   */
  public async get<T>(key: any): Promise<T> {
    const dataInCache = this.cache[key];
    if (dataInCache) return dataInCache;
    else {
      let file = null;

      try {
        file = await readFile(`${DATA_DIR}/${key}.dat`);
      } catch {}

      if (file) {
        file = zlib
          .inflateSync(file, {
            level: zlib.constants.Z_BEST_COMPRESSION,
          })
          ?.toString();

        try {
          file = JSON.parse(file);
        } catch {}

        if (file.type === "Buffer" && Array.isArray(file.data))
          file = Buffer.from(file.data);

        this.cache[key] = file;
      }

      return file;
    }
  }

  /**
   * Sets or replace the key's data.
   * This function will return `false` if the file is still being written to by another `set` function.
   * It returns `true` if it has successfully written/overwrided the data of they key.
   * @param key The unique key.
   * @param data The data of the key.
   */
  public async set(key: any, data: any) {
    return (this.cache[key] = data);
  }

  /**
   * Checks whether or not the key is in the database.
   * @param key The unique key.
   */
  public async contains(key: any) {
    let res;

    if (this.cache.hasOwnProperty(key)) res = true;
    else res = !!(await readFile(`${DATA_DIR}/${key}.dat`).catch(() => false));

    return res;
  }
}

export default DefaultDb;
