const chance = require('./fake-chance').instance;

// proxy event listener to make testing easier
XMLHttpRequest.prototype.addEventListener = function(type, callback) {
    if (type == 'readystatechange') {
        const currentStatus = chance.httpStatus();

        const newThis = {
            getResponseHeader: this.getResponseHeader,
            readyState: 4,
            status: currentStatus.code,
            statusText: currentStatus.text
        };

        callback.call(newThis);
    }
};
XMLHttpRequest.prototype.getResponseHeader = function(type) {
    if (type === 'Content-Type') {
        return chance.httpContentType().type;
    }
    else if (type === 'X-Glimpse-ContextId') {
        return chance.guid();
    }
    else if (type === 'Content-Length') {
        return chance.integerRange(1000, 5000);
    }
};
XMLHttpRequest.prototype.send = function() {};

// generate requests on a schedule
function spawnRequest() {
    setTimeout(function() {
        const httpRequest = new XMLHttpRequest();
        httpRequest.open(chance.httpMethod(), chance.httpPath(), true);
        httpRequest.send();

        spawnRequest();
    }, chance.integerRange(1000, 5000));
}
//spawnRequest();
