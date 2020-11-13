import http from "http";

/**
 * Starts the HTTP Server.
 * @param port The server's port.
 * @param ip The server's ip the use.
 */
const Http = (port: number, ip: string) => {
  const server = http.createServer((req, res) => {
    if (req.url !== "/growtopia/server_data.php") return res.destroy();
    const packet = `server|${ip}
port|${port}
type|1
meta|undefined
RTENDMARKERBS1001`;

    res.write(packet, () => res.end());
  });

  server.listen(80, "0.0.0.0");
};

export default Http;
