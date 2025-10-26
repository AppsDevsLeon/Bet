const express = require('express');
const router = express.Router()

const redisClient = require('../services/redisClient');


const {
    getAllMatches,
    getLiveOdds,
    getFixtureOdds,
    getUpcomingOdds
} = require('../services/apiSports');

const { getInPlay,
        getUpcoming
 } = require('../utils/resHelper');

router.post('/', async (req, res) => {
    try {
        const { sportKey } = req.body;
        console.log('sportKey: ', sportKey);

        const cacheKey = `sportKey:${sportKey.toLowerCase()}`

        const cacheData = await redisClient.get(cacheKey);
        if(cacheData){
            console.log('Respuesta de /in-play desde Redis');
            return res.status(200).json(JSON.parse(cacheData));
        }

        const response = await getAllMatches(sportKey);

        await redisClient.setEx(cacheKey, 3600, JSON.stringify(response));
        res.status(200).json(response);
    } catch (error) {
        console.error('Error "/": ', error.message);
        console.error('Error "/": ', error.stack);
        res.status(500).json({ error: 'Hubo un error en el llamado al API' });
    }
});

router.post('/in-play', async (req, res) => {
    try {

        const { sportKey } = req.body;
        console.log('oddsKey: ', sportKey);


        // Llave única para guardar la información en redis
        const cacheKey = `oddsKey:${sportKey.toLowerCase()}`;

        // Valida si ya existe información en cache
        const cacheData = await redisClient.get(cacheKey);
        if (cacheData) {
            console.log('Respuesta de /in-play desde Redis');
            return res.status(200).json(JSON.parse(cacheData));
        }

        const response = await getLiveOdds(sportKey,'');

        const result = await getInPlay(sportKey, response, true);

        // Guarda la respuesta de la API en cache
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(result));
        res.status(200).json(result);


    } catch (error) {
        console.error('Error "/in-play": ', error.message);
        console.error('Error "/in-play": ', error.stack);
        res.status(500).json({ error: 'Hubo un error en el llamado al API' });
    }
});

router.post('/event', async (req, res) => {
    try {
        console.log('/evento');
        const { sportKey, fixtureId } = req.body;
        console.log('fixtureId: ', fixtureId);

        // Llave única para guardar la información en redis
        const cacheKey = `fixtureId:${fixtureId}`;

        // Valida si ya existe información en cache
        const cacheData = await redisClient.get(cacheKey);
        if (cacheData) {
            console.log('Respuesta de /evento desde Redis');
            return res.status(200).json(JSON.parse(cacheData));
        }

        const response = await getFixtureOdds(sportKey,fixtureId);

        const result = await getInPlay(sportKey, response, false);

        // Guarda la respuesta de la API en cache
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(result));
        res.status(200).json(result);


    } catch (error) {
        console.error('Error "/in-play": ', error.message);
        console.error('Error "/in-play": ', error.stack);
        res.status(500).json({ error: 'Hubo un error en el llamado al API' });
    }
});

router.post('/upcoming', async (req, res) => {
    try {
        console.log('/upcoming');
        const { sportKey, date } = req.body;
        console.log('fecha: ', date);

        // Llave única para guardar la información en redis
        const cacheKey = `fechaEvento:${date.replaceAll("-","")}`;

        // Valida si ya existe información en cache
        const cacheData = await redisClient.get(cacheKey);
        if (cacheData) {
            console.log('Respuesta de /eventoFuturo desde Redis');
            return res.status(200).json(JSON.parse(cacheData));
        }

        const response = await getUpcomingOdds(sportKey,date);

        const result = await getUpcoming(sportKey, response);

        // Guarda la respuesta de la API en cache
        await redisClient.setEx(cacheKey, 86400, JSON.stringify(result));
        res.status(200).json(result);

    } catch (error) {
        console.error('Error "/in-play": ', error.message);
        console.error('Error "/in-play": ', error.stack);
        res.status(500).json({ error: 'Hubo un error en el llamado al API' });
    }
});


module.exports = router;

