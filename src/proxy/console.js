const methods = [
    'error',
    'info',
    'warn'
];
const listeners = [];

methods.forEach(function(methodKey) {
    console[methodKey] = (function (key) {
        const oldFunction = console[key];
        const newFunction = function () {
            const args = Array.prototype.slice.call(arguments);

            publishLog({ method: key, arguments: args });

            return oldFunction.apply(this, arguments);
        };

        return newFunction;
    }(methodKey));
});

function publishLog(details) {
    for (let i = 0; i < listeners.length; i++) {
        listeners[i](details);
    }
}

module.exports = {
    registerListener: function(callback) {
        listeners.push(callback);
    }
};
