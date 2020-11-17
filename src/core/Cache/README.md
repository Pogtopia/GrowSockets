# Caching

Caching provides as the temporary data store which has fast read/writes ideal for game servers.

## Standard

When making custom cache for `GrowSockets`, there must be a **standard** followed.
`keys(pattern: string) => string[]` - A method where you can fetch keys that match that specific pattern. (Not regex).

`set(key: string, val: any) => any` - Sets or replace a specific key in the cache with the value specified.

`remove(key: string) => boolean` - Removes a key from the cache.

`get(key: string) => any` - Fetches the data of the key from the cache. If the data is a valid JSON object, it should parse it to a JS Object.

`contains(key: string) => boolean` - Whether or not a key exists within the cache.
