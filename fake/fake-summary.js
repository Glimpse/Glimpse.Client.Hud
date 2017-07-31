const chance = require('./fake-chance').instance;

const path = '/glimpse/context-summary';

const oldSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function() {
    if (this._url && this._url.indexOf(path) > -1) {
        setTimeout(() => {
            const result = createSummary();

            this.fakeResponseText = JSON.stringify(result);
            this.onload()
        }, chance.integerRange(100, 500));

        return;
    }
    oldSend.apply(this, arguments);
}

const oldOpen = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.open = function(method, url) {
    if (path.indexOf(path) > -1) {
        this._url = url;

        return;
    }
    oldOpen.apply(this, arguments);
}

// proxy event listener to make testing easier
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
