const util = require('../lib/util');
const dom = require('../lib/dom');
const messagesUtil = require('../lib/messages');

function processType(type, indexedMessages) {
    const messages = indexedMessages[type];
    const result = { total: 0, time: 0 };
    if (messages && messages.length) {
        messages.forEach(function(message) {
            result.total++;
            result.time += parseInt(message.payload.duration);
        });
    }
    return result;
}
function process(indexedMessages) {
    const result = {};
    result.httpClient = processType('data-http-response', indexedMessages);
    result.dataStore = processType('data-store-end', indexedMessages);
    result.summary = {
        total: result.httpClient.total + result.dataStore.total,
        time: result.httpClient.time + result.dataStore.time
    };
    return result;
}

function update(data) {
    updateValue('glimpse-data-summary-value', data.summary);
    updateValue('glimpse-data-popup-summary-value', data.summary);
    updateValue('glimpse-data-popup-httpClient-value', data.httpClient);
    updateValue('glimpse-data-popup-dataStore-value', data.dataStore);
}
function updateValue(target, data) {
    const element = document.getElementById(target);

    let content = data.total;
    if (data.total > 0) {
        dom.addClass(element, 'glimpse-time-ms');

        content += ' / ' + data.time;
    }
    element.innerHTML = content;
}

module.exports = {
    preInit: function(initPromise) {
        const contextMessagesPromise = fetch(util.resolveContextUrl(util.currentRequestId()))
            .then(function(response) {
                return response.json();
            });

        Promise.all([
            contextMessagesPromise,
            initPromise
        ]).then(values => {
            const rawMessages = values[0];
            const indexedMessages = messagesUtil.indexMessages(rawMessages);
            const data = process(indexedMessages);
            update(data);
        });
    },
    render: function() {
        return `
            <div class="glimpse-section glimpse-data">
                <div class="glimpse-section-summary">
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">
                            I/O Calls
                        </div>
                        <div class="glimpse-hud-field-value" id="glimpse-data-summary-value">
                            --
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    renderPopup: function() {
        return `
            <div class="glimpse-hud-popup-section">
                <div class="glimpse-hud-field">
                    <div class="glimpse-hud-field-label">I/O Calls</div>
                    <div class="glimpse-hud-field-value" id="glimpse-data-popup-summary-value">
                        --
                    </div>
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">Http Client</div>
                        <div class="glimpse-hud-field-value" id="glimpse-data-popup-httpClient-value">
                            --
                        </div>
                    </div>
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">Data Store</div>
                        <div class="glimpse-hud-field-value" id="glimpse-data-popup-dataStore-value">
                            --
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
