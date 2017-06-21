export function indexMessages(messages) {
    var index = {};
    for (var i = 0; i < messages.length; i++) {
        var message = messages[i];
        for (var x = 0; x < message.types.length; x++) {
            var type = message.types[x];
            if (!index[type]) {
                index[type] = [];
            }
            index[type].push(message);
        }
    }

    return index;
};
