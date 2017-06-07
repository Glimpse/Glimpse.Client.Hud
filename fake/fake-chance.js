const Chance = require('chance');

const chance = new Chance();
const urls = [ '/news/latest', '/news/item/123', '/news/item/453', '/news/item/add', '/news/item/remove' ];
const methods = [ 'GET', 'GET', 'GET', 'GET', 'POST', 'POST', 'POST', 'PUT', 'PUSH', 'DELETE' ];
const statuses = [ 100, 200, 200, 200, 200, 200, 200, 404, 404, 403, 403, 500, 304 ];
const statusText = { 200: 'OK', 404: 'Not Found', 500: 'Server Error', 304: 'OK', 403: 'Error' };
const protocols = [ 'http', 'http', 'https' ];

chance.mixin({
    'integerRange': (min, max) => {
        return chance.integer({ min: min, max: max });
    },
    'durationRange': (min, max) => {
        return chance.floating({ min: min, max: max, fixed: 2 });
    },
    'dateRange': (min, max) => {
        const time = new Date().getTime();
        const difference = chance.integerRange(min, max);
        const newTime = new Date(time + difference);

        return newTime;
    },
    'httpPath': () => {
        return chance.pickone(urls);
    },
    'httpMethod': () => {
        return chance.pickone(methods);
    },
    'httpStatus': () => {
        var code = chance.pickone(statuses);
        return {
            code: code,
            text: statusText[code]
        };
    },
    'httpContentType': () => {
        return { type: 'text/html', category: { 'document': true } };
    },
    'httpProtocol': () => {
        return chance.pickone(protocols);
    },
});

module.exports = {
    instance: chance
};
