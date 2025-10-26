const { createClient } = require('redis');

const redisClient = createClient({
    url: "redis://localhost:6379"
});

redisClient.on('err', () => {
    console.error('Error en redis:', err);
});

(async () => {
    await redisClient.connect();
    console.log('Conectado a Redis');
})();

module.exports = redisClient;