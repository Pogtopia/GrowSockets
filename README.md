# GrowSockets

A simple to use api for creating private servers for Growtopia with NodeJS.  
GrowSockets is still WIP but the core is done, only thing left to be added would be the "abstractions".

## Requirements

- Node v12+
- Windows Build Tools (g++ for Linux. Just install `build-essential`).

## Installation

**NPM**

- `$ npm install Pogtopia/GrowSockets`

**Yarn**

- `$ yarn add Pogtopia/GrowSockets`

## Example

```js
const GrowSockets = require("growsockets");
const server = new GrowSockets.Server({
  http: {
    enabled: true,
  },
});

server.on("connect", (netID) => {
  console.log("Peer", netID, "connected.");

  const peer = GrowSockets.Peer.new(server, netID);
  const packet = GrowSockets.TextPacket.from(0x1);

  peer.send(packet);
});

server.on("data", async (netID, chunk) => {
  const peer = GrowSockets.Peer.new(server, netID);
  console.log(peer.data); // shows the peer data.
});

server.on("disconnect", (netID) => console.log("Peer", netID, "disconnected"));
server.listen();
```

## Documentation

Coming soon.
