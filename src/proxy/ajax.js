const util = require('../lib/util');

const listeners = [];

const open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, uri) {
    if (util.isLocalUri(uri) && uri.indexOf('/glimpse/') == -1) {
        const startTime = new Date().getTime();
        this.addEventListener(
            'readystatechange',
            function() {
                if (this.readyState == 4 && this.getResponseHeader('X-Glimpse-ContextId')) {
                    registerRequest(method, uri, startTime, this);
                }
            },
            false
        );
    }

    open.apply(this, arguments);
};

function registerRequest(method, uri, startTime, xhrObj) {
    const details = {
        method: method,
        uri: uri,
        duration: new Date().getTime() - startTime,
        size: xhrObj.getResponseHeader('Content-Length'),
        status: xhrObj.status,
        statusText: xhrObj.statusText,
        time: new Date(),
        contentType: xhrObj.getResponseHeader('Content-Type'),
        requestId: xhrObj.getResponseHeader('X-Glimpse-ContextId')
    };

    for (let i = 0; i < listeners.length; i++) {
        listeners[i](details);
    }
}

module.exports = {
    registerListener: function(callback) {
        listeners.push(callback);
    }
};