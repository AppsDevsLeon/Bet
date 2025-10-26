const oddIdInPlay = JSON.parse(process.env.oddIdInPlay);

const {
    getTeamName,
    getFixture
} = require('../services/apiSports')

const redisClient = require('../services/redisClient');

// Función de prueba que solo regresa un extracto de deportes
async function getInPlay(sportKey, apiResponse, allGames) {
    console.log('getInPlay');
    let i = 0;
    let result = [];

    for (const inPlay of apiResponse.response) {
        //const result = Promise.all(apiResponse.response.map(async inPlay => {
        console.log('dentro de if i:', i)
        let oddArray = [];

        if (allGames) {
            oddIdInPlay.forEach(id => {
                console.log('Id de oddIdInPlay');
                let odd = inPlay.odds.find(o => o.id === parseInt(id));
                if (odd) {
                    oddArray.push({
                        id: odd.id,
                        name: odd.name,
                        values: odd.values.map(value => ({
                            value: value.value,
                            odd: value.odd,
                            handicap: value.handicap
                        }))
                    });
                }
            }); // Aquí termina forEach de oddIdInPlay
        } else {
            oddArray = inPlay.odds;
        };

        console.log('antes de getNames');
        const homeName = await getNames(sportKey, inPlay.teams.home.id);
        const awayName = await getNames(sportKey, inPlay.teams.away.id);

        console.log('homeName', homeName);
        result.push({
            fixture: {
                id: inPlay.fixture.id,
                status: {
                    long: inPlay.fixture.status.long,
                    elapsed: inPlay.fixture.status.elapsed,
                    seconds: inPlay.fixture.status.seconds
                }
            },
            league: {
                id: inPlay.league.id,
                season: inPlay.league.season
            },
            teams: {
                home: {
                    name: homeName,
                    goals: inPlay.teams.home.goals
                },
                away: {
                    name: awayName,
                    goals: inPlay.teams.away.goals
                }
            },
            odds: oddArray
        });
        if (i === 3) {
            break;
        }
        i++;
    }
    console.log('result', result);
    return result;

}

/* Función que regresa todos los deportes
async function getInPlay(sportKey, apiResponse) {
    console.log('getInPlay');

    const result = Promise.all(apiResponse.response.map(async inPlay => {
        let oddArray = [];

        oddIdInPlay.forEach(id => {
            console.log('Id de oddIdInPlay');
            let odd = inPlay.odds.find(o => o.id === parseInt(id));
            if (odd) {
                oddArray.push({
                    id: odd.id,
                    name: odd.name,
                    values: odd.values.map(value => ({
                        value: value.value,
                        odd: value.odd,
                        handicap: value.handicap
                    }))
                });
            }
        }); // Aquí termina forEach de oddIdInPlay

        console.log('antes de getNames');
        const homeName = await getNames(sportKey, inPlay.teams.home.id);
        const awayName = await getNames(sportKey, inPlay.teams.away.id);

        console.log('homeName', homeName);

        return {
            fixture: {
                id: inPlay.fixture.id,
                status: {
                    long: inPlay.fixture.status.long,
                    elapsed: inPlay.fixture.status.elapsed,
                    seconds: inPlay.fixture.status.seconds
                }
            },
            league: {
                id: inPlay.league.id,
                season: inPlay.league.season
            },
            teams: {
                home: {
                    name: homeName,
                    goals: inPlay.teams.home.goals
                },
                away: {
                    name: awayName,
                    goals: inPlay.teams.away.goals
                }
            },
            odds: oddArray
        };
    }));
    
    console.log('result', result);
    return result;
}
*/
async function getNames(sportKey, teamId) {
    console.log('getNames', getNames);
    const cacheKey = `teamId:${teamId}`;

    const cacheData = await redisClient.get(cacheKey);
    if (cacheData) {
        console.log('Respuesta de teamNames desde Redis');
        return cacheData;
    }

    const apiResponse = await getTeamName(sportKey, teamId);
    const { team: { name: teamName } } = apiResponse.response[0];
    await redisClient.setEx(cacheKey, 36000, teamName);

    return teamName;
}

// Función que trae solo un extracto de eventos futuros
async function getUpcoming(sportKey, apiResponse) {
    console.log('getFuture');
    let i = 0;
    let result = [];
    

    //const result = Promise.all(apiResponse.response.map(async futureEvent => {
    for (let futureEvent of apiResponse.response) {
        const fixtureResponse = await getFixture(sportKey, futureEvent.fixture.id);

        
        result.push({
            league: {
                id: futureEvent.league.id,
                name: futureEvent.league.name,
                country: futureEvent.league.country,
                season: futureEvent.league.season
            },
            fixture: {
                id: futureEvent.fixture.id,
                timezone: futureEvent.fixture.timezone,
                date: futureEvent.fixture.date
            },
            teams: {
                home: {
                    id: fixtureResponse.response[0].teams.home.id,
                    name: fixtureResponse.response[0].teams.home.name
                },
                away: {
                    id: fixtureResponse.response[0].teams.away.id,
                    name: fixtureResponse.response[0].teams.away.name
                }
            },
            odds: futureEvent.bookmakers
        });
        if (i === 3) {
            break;
        }
        i++;
    };
    console.log('result', result);
    return result;
}


/* Función que trae todos los eventos futuros
async function getUpcoming(sportKey, apiResponse) {
    console.log('getFuture');

    const result = Promise.all(apiResponse.response.map(async futureEvent => {

        const fixtureResponse = await getFixture(sportKey, futureEvent.fixture.id);
        console.log('fixtureResponse',fixtureResponse);
        console.log('futureEvent.fixture.id',futureEvent.fixture.id);

        return {
            league: {
                id: futureEvent.league.id,
                name: futureEvent.league.name,
                country: futureEvent.league.country,
                season: futureEvent.league.season
            },
            fixture: {
                id: futureEvent.fixture.id,
                timezone: futureEvent.fixture.timezone,
                date: futureEvent.fixture.date
            },
            teams: {
                home: {
                    id: fixtureResponse.reponse[0].teams.home.id,
                    name: fixtureResponse.reponse[0].teams.home.name
                },
                away: {
                    id: fixtureResponse.reponse[0].teams.away.id,
                    name: fixtureResponse.reponse[0].teams.away.id
                }
            },
            odds: futureEvent.bookmakers
        };
    }));
    console.log('result', result);
    return result;
}
*/

module.exports = {
    getInPlay,
    getNames,
    getUpcoming
}
