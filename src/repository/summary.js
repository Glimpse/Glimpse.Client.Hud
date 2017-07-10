const util = require('../lib/util');

const getPromise = new Promise(function(resolve, reject) {
    const request = new XMLHttpRequest();

    request.onload = function() {
        const response = FAKE_SERVER ? this.fakeResponseText : this.responseText;

        resolve(JSON.parse(response));
    }

    request.onerror = function(err) {
        reject(err);
    }

    request.open('get', util.resolveContextSummaryUrl(util.currentRequestId()), true);
    request.send();
});

module.exports = {
    getPromise: function() {
        return getPromise;
    }
};
