import { createServer } from "node:http";

const server = createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Server is running on port 3000");
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
})