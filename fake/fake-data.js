const chance = require('./fake-chance').instance;

// proxy event listener to make testing easier
const oldFetch = window.fetch;
window.fetch = (path, options) => {
    if (path.indexOf('/glimpse/context') > -1) {
        return new Promise(resolve => fetchContext(resolve));
    }

    return oldFetch(path, options);
};

function fetchContext(resolve) {
    setTimeout(() => {
        const totalHttpClient = chance.integerRange(0, 3);
        const totalDataStore = chance.integerRange(0, 5);

        const result = [];
        createMessages('data-http-response', totalHttpClient, result);
        createMessages('data-store-end', totalDataStore, result);

        var response = {
            'ok' : true,
            'json': () => new Promise(resolve => resolve(result))
        };

        resolve(response);
    }, chance.integerRange(100, 500));
}

function createMessages(type, total, collection) {
    for (var i = 0; i < total; i++) {
        collection.push(createMessage(type));
    }
}
function createMessage(type) {
    return {
        types: [ type ],
        payload: {
            duration: chance.durationRange(5, 50)
        }
    };
}
