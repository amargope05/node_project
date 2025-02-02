const http = require('http');
const { createProxyServer } = require('http-proxy');

const servers = [
  { host: 'localhost', port: 3001 },
  { host: 'localhost', port: 3002 },
  { host: 'localhost', port: 3003 },
];

let currentServer = 0;

const proxy = createProxyServer();

const loadBalancer = http.createServer((req, res) => {
  const server = servers[currentServer];
  console.log("______ ",server)
  currentServer = (currentServer + 1) % servers.length;

  proxy.web(req, res, { target: `http://${server.host}:${server.port}` }, (err) => {
    console.error('Error proxying request:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error while forwarding the request to the server.');
  });
});

loadBalancer.listen(3000, () => {
  console.log('Load balancer running on port 3000');
});
