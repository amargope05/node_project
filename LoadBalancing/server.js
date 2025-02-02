const http = require('http');

function createServer(port) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Response from server : port ${port}\n`);
  });

  server.listen(port, () => {
    console.log(`Backend server : port ${port}`);
  });
}

createServer(3001);
createServer(3002);
createServer(3003);
