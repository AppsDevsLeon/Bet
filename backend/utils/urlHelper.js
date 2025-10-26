const redisClient = require('../services/redisClient');

function getSportUrl(sport) {
    let url;
    switch (sport) {
        case "afl":
            url = "https://v1.afl.api-sports.io/";
            break;
        case "baseball":
            url = "https://v1.baseball.api-sports.io/";
            break;
        case "basketball":
            url = "https://v1.basketball.api-sports.io/";
            break;
        case "f1":
            url = "https://v1.formula-1.api-sports.io/";
            break;
        case "balonmano":
            url = "https://v1.handball.api-sports.io/";
            break;
        case "hockey":
            url = "https://v1.hockey.api-sports.io/";
            break;
        case "mma":
            url = "https://v1.mma.api-sports.io/";
            break;
        case "nfl":
            url = "https://v1.american-football.api-sports.io/";
            break;
        case "nfl":
            url = "https://v1.american-football.api-sports.io/";
            break;
        case "rugby":
            url = "https://v1.rugby.api-sports.io/";
            break;
        case "volleyball":
            url = "https://v1.volleyball.api-sports.io/";
            break;
        case "soccer":
        default:
            url = "https://v3.football.api-sports.io/";
    }

    return url;
}

module.exports = {
    getSportUrl
};

