const util = require('../lib/util');

const listeners = [];

const oldFetch = self.fetch;
self.fetch = function(input, init) {
    // setup requests so we can read data
    let request;
    if (input instanceof Request) {
        request = input.clone();
    } else {
        try {
            request = new Request(input, init);
        } catch (e) {
            return oldFetch.apply(this, arguments);
        }
    }

    const startTime = new Date().getTime();
    const uri = request.url;

    // pass call through to caller
    const fetchPromise = oldFetch.apply(this, arguments);
    if (util.isLocalUri(uri) && uri.indexOf('/glimpse/') == -1) {
        fetchPromise.then(function(response) {
            response = response.clone();

            if (response.headers.get('X-Glimpse-ContextId')) {
                publishRequest(buildFetchModel(request, response, startTime));
            }
        }, function(error) {
            // nothing we can do
        });
    }

    return fetchPromise;
}

function buildFetchModel(request, response, startTime) {
    return {
        method: request.method,
        uri: response.url,
        duration: new Date().getTime() - startTime,
        size: response.headers.get('Content-Length'),
        status: response.status,
        statusText: response.statusText,
        time: new Date(),
        contentType: response.headers.get('Content-Type'),
        requestId: response.headers.get('X-Glimpse-ContextId')
    };
}

const open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, uri) {
    if (util.isLocalUri(uri) && uri.indexOf('/glimpse/') == -1) {
        const startTime = new Date().getTime();
        this.addEventListener(
            'readystatechange',
            function() {
                if (this.readyState == 4 && this.getResponseHeader('X-Glimpse-ContextId')) {
                    publishRequest(buildAjaxModel(method, uri, startTime, this));
                }
            },
            false
        );
    }

    open.apply(this, arguments);
};

function buildAjaxModel(method, uri, startTime, xhrObj) {
    return {
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
}

function publishRequest(details) {
    for (let i = 0; i < listeners.length; i++) {
        listeners[i](details);
    }
}

module.exports = {
    registerListener: function(callback) {
        listeners.push(callback);
    }
};
