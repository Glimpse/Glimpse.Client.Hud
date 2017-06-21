const util = require('../lib/util');
const messagesUtil = require('../lib/messages');

const defaultSummary = { total: '--', time: '--' }

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
    document.getElementById(target).innerHTML = data.total + ' / ' + data.time;
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
        const timings = { summary: defaultSummary };

        return `
            <div class="glimpse-section glimpse-data">
                <div class="glimpse-section-summary">
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">
                            I/O Calls
                        </div>
                        <div class="glimpse-hud-field-value glimpse-time-ms" id="glimpse-data-summary-value">
                            ${timings.summary.total} / ${timings.summary.time}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    renderPopup: function() {
        const timings = { summary: defaultSummary, httpClient: defaultSummary, dataStore: defaultSummary };

        return `
            <div class="glimpse-hud-popup-section">
                <div class="glimpse-hud-field">
                    <div class="glimpse-hud-field-label">I/O Calls</div>
                    <div class="glimpse-hud-field-value glimpse-time-ms" id="glimpse-data-popup-summary-value">
                        ${timings.summary.total} / ${timings.summary.time}
                    </div>
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">Http Client</div>
                        <div class="glimpse-hud-field-value glimpse-time-ms" id="glimpse-data-popup-httpClient-value">
                            ${timings.httpClient.total} / ${timings.httpClient.time}
                        </div>
                    </div>
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">Data Store</div>
                        <div class="glimpse-hud-field-value glimpse-time-ms" id="glimpse-data-popup-dataStore-value">
                            ${timings.dataStore.total} / ${timings.dataStore.time}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
