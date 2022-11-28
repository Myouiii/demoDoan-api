const redis = require('redis');
const client = redis.createClient({
    port: 6379,
    host: "127.0.0.1"
})
client.ping((err, pong) => {
    console.log(pong);
})
client.on("error", (error) => {
    console.log(`[*] Redis error:\n${error}`);
});
client.on("connect", (error) => {
    console.log(`[*] Redis connected`);
});
client.on("ready", (error) => {
    console.log(`[*] Redis is ready`);
});
module.exports = client;
//redis-commander cmd
//redis-server wsl ubuntu
// npm uninstall --save redis
// npm install --save redis@3.1.2
// http://127.0.0.1:8081 redis-commander npm install --save redis@3.1.2
