var UriTemplate = require('uri-templates');
var usedMessageTypes = function() {
    return 'data-http-response,data-store-end';
}
var hudScriptElement = document.getElementById('__glimpse_hud');

module.exports = {
    toCamelCase: function(value) {
        return value.replace(camelCaseRegEx, function(match, p1, p2, offset) {
            if (p2) {
                return p2.toUpperCase();
            }
            return p1.toLowerCase();
        });
    },
    currentRequestId: function() {
        return hudScriptElement.getAttribute('data-request-id');
    },
    resolveClientUrl: function(requestId, follow) {
        var clientTemplate = new UriTemplate(hudScriptElement.getAttribute('data-client-template'));

        return clientTemplate.fill({
            requestId: requestId,
            follow: follow,
            metadataUri: hudScriptElement.getAttribute('data-metadata-template'),
        });
    },
    resolveContextUrl: function(requestId) {
        var contextTemplate = hudScriptElement.getAttribute('data-context-template');

        var params = requestId + '&types=' + usedMessageTypes()

        var uri = contextTemplate.replace('{contextId}{&types}', params); // TODO: This should probably be resolved with a URI Template library
        return encodeURI(uri);
    },
    isLocalUri: function(uri) {
        return uri && (!(uri.indexOf('http://') == 0 || uri.indexOf('https://') == 0 || uri.indexOf('//') == 0) ||
                (uri.substring(uri.indexOf('//') + 2, uri.length) + '/').indexOf(window.location.host + '/') == 0);
    }
};
