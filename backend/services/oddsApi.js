
const axios = require('axios');

const { theLeagues } = require('../utils/sports');

const apiKey = process.env.ODDS_API_KEY;


// console.log(apiKey);

// const sportsKey = 'uncoming';
// const regions = 'us';
// const markest = 'h2h';
// const oddsFormat = 'decimal';
// const dateFormat = 'iso';

// async function getAllMatches() {
//     const response = await axios.get('https://api.the-odds-api.com/v4/sports/soccer_epl/odds', {
//         params: {
//             apiKey,
//             regions: 'eu',
//             markets: 'h2h',
//             oddsFormat: 'decimal'
//         }
//     });

//     return response.data;
// };

// exports.module = { getAllMatches };


const oddsApiUrl = `https://api.the-odds-api.com/v4/sports`

function quota(response) {
    console.log('Remaining requests', response.headers['x-requests-remaining'])
    console.log('Used requests', response.headers['x-requests-used'])
}


async function getAllSports() {
    console.log('getAllSports');
    const response = await axios.get(`${oddsApiUrl}?all=true`, {
        params: {
            apiKey
        }
    });
    return response;
};

async function getSportsMatches(sportKey) {
    console.log('getSportsMatches');
    console.log(sportKey);
    const response = await axios.get(`${oddsApiUrl}/${sportKey}/events`, {
        params: {
            apiKey
        }
    });
    quota(response);
    return response.data;
};
/*
    Función para regresar las ligas definidas para la app 
*/
async function getSportLeagues(sportGroup) {
    sportGroup = sportGroup || "Soccer";
    // Obtiene las ligas definidas para la app en base al deporte que se le proporcione
    const leagues = theLeagues(sportGroup);
    const response = await getAllSports();
    // Filtra response para dejar solo las ligas que están definidas para la app
    const sportLegue = response.data
        .filter(item => item.group === sportGroup)
        .filter(item => {
            for (let league of leagues) {
                if (item.key === league) {
                    return item;
                }
            }
        });
    quota(response);
    return sportLegue;
};

async function getOdds(sportGroup) {
    console.log('getOdds');
    const regions = 'us';
    const markets = 'h2h';
    const leagues = theLeagues(sportGroup);
    const response = await axios.get(`${oddsApiUrl}/${sportGroup}/odds`, {
        params: {
            apiKey,
            regions,
            markets
        }
    });
    
    const sportLegueOdds = response.data
        .filter(item => {
            for (let league of leagues) {
                if (item.sport_key === league) {
                    return item;
                }
            }
        });
    quota(response);
    return sportLegueOdds;
};


module.exports = {
    getAllSports,
    getSportsMatches,
    getSportLeagues,
    getOdds
};



