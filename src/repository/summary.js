const util = require('../lib/util');

const getPromise = new Promise(function(resolve, reject) {
    const request = new XMLHttpRequest();

    request.onload = function() {
        resolve(JSON.parse(this.responseText));
    }
    
    request.onerror = function() {
        reject();
    }

    request.open('get', util.resolveContextSummaryUrl(util.currentRequestId()), true);
    request.send(); 
});

module.exports = {
    getPromise: function() {
        return getPromise;
    }
};
