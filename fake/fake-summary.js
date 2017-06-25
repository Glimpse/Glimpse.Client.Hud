const chance = require('./fake-chance').instance;

// proxy event listener to make testing easier
const oldFetch = window.fetch;
window.fetch = (path, options) => {
    if (path.indexOf('/glimpse/context-summary') > -1) {
        return new Promise(resolve => fetchContextSummary(resolve));
    }

    return oldFetch(path, options);
};

function fetchContextSummary(resolve) {
    setTimeout(() => {
        const result = createSummary();

        var response = {
            'ok' : true,
            'json': () => new Promise(resolve => resolve(result))
        };

        resolve(response);
    }, chance.integerRange(100, 500));
}

function createSummary() {
    return {
        summary: {
            server: {
                dataStore: createDataStoreSummary(),
                webServices: createWebServicesSummary(),
                logs: {
                    totalErrorCount: chance.integerRange(0, 2),
                    totalWarnCount: chance.integerRange(0, 3),
                    totalInfoCount: chance.integerRange(0, 4)
                }
            }
        }
    };
}

function createDataStoreSummary() {
    let totalCount = chance.integerRange(0, 5);
    let totalTime = 0

    const listing = [];
    for (let i = 0; i < totalCount; i++) {
        const time = chance.durationRange(1, 50);

        listing.push({
            duration: time,
            operation: 'NotNeededAtm',
            operationCategory: chance.pickone(['Create', 'Read', 'Update', 'Delete', 'Other'])
        });

        totalTime += time;
    }

    return {
        totalCount: totalCount,
        totalTime: totalTime,
        listing: listing
    };
}

function createWebServicesSummary() {
    let totalCount = chance.integerRange(0, 3);
    let totalTime = 0

    const listing = [];
    for (let i = 0; i < totalCount; i++) {
        const time = chance.durationRange(20, 100);

        listing.push({
            duration: time,
            url: 'http://test',
            method: chance.httpMethod(),
            statusCode: chance.httpStatus().code
        });

        totalTime += time;
    }

    return {
        totalCount: totalCount,
        totalTime: totalTime,
        listing: listing
    };
}
