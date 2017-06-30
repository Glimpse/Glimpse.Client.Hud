const util = require('../lib/util');
require('whatwg-fetch');

const getPromise = fetch(util.resolveContextSummaryUrl(util.currentRequestId()))
    .then(
        function(response) {
            return response.json();
        }
    );

module.exports = {
    getPromise: function() {
        return getPromise;
    }
};
