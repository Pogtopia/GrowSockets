import { readFile, writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";

const DATA_DIR = `${__dirname}/data`;

/**
 * The class for the default database which uses fs.
 */
class DefaultDb {
  private cache = {};

  constructor() {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR);
    setInterval(() => {
      this.save();
    }, 60 * 30 * 1000); // save every 30 mins
  }

  private async save() {
    const keys = Object.keys(this.cache);

    keys.forEach((key) => {
      let data = this.cache[key];
      if (typeof data === "object") data = JSON.stringify(data);

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
    // do a manual save
    let data = this.cache[key];
    if (!data) return false;

    if (typeof data === "object") data = JSON.stringify(data);
    await writeFile(`${DATA_DIR}/${key}.dat`, data); // save

    delete this.cache[key];
  }

  /**
   * Fetches data from the database.
   * @param key The unique key.
   */
  public async get(key: any) {
    const dataInCache = this.cache[key];
    if (dataInCache) return dataInCache;
    else {
      let file = null;

      try {
        file = (await readFile(`${DATA_DIR}/${key}.dat`))?.toString();
      } catch {}

      if (file)
        try {
          this.cache[key] = JSON.parse(file);
        } catch {
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
    this.cache[key] = data;
  }
}

export default DefaultDb;
