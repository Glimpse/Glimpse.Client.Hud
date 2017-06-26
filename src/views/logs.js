const dom = require('../lib/dom');
const consoleProxy = require('../proxy/console');
const summaryRepository = require('../repository/summary');
const icons = require('../assets/icons').default;

const supportedLevels = [ 'error', 'warn', 'info' ];
const state = {
    data: {
        server: defaultDataState(),
        browser: defaultDataState()
    },
    ready: false,
    preRenderCache: []
};

function defaultDataState() {
    return {
        error: 0,
        warn: 0,
        info: 0
    };
}

function updateServer(requestDetails) {
    const serverData = state.data.server;
    const logSummary = requestDetails.summary.server.logs;

    serverData.error = logSummary.totalErrorCount;
    serverData.warn = logSummary.totalWarnCount;
    serverData.info = logSummary.totalInfoCount;

    updateSummary();
    updateView(serverData, 'glimpse-logs-popup-server-value');
}
function updateBrowser(log) {
    const level = log.method;
    if (supportedLevels.indexOf(level) > -1) {
        const browserData = state.data.browser;
        browserData[level]++;

        updateSummary();
        updateView(browserData, 'glimpse-logs-popup-browser-value');
    }
}
function updateSummary() {
    const serverData = state.data.server;
    const browserData = state.data.browser;

    const summaryData = {
        error: serverData.error + browserData.error,
        warn: serverData.warn + browserData.warn,
        info: serverData.info + browserData.info,
    };

    updateView(summaryData, 'glimpse-logs-count');
    updateView(summaryData, 'glimpse-logs-popup-summary-value');
}
function updateView(data, target) {
    const content = `
        <span${iconSectionHasValueClass(data.error)}>${icons.error} ${data.error}</span>
        <span${iconSectionHasValueClass(data.warn)}>${icons.warn} ${data.warn}</span>
        <span${iconSectionHasValueClass(data.info)}>${icons.info} ${data.info}</span>
    `;

    document.getElementById(target).innerHTML = content;
}
function iconSectionHasValueClass(total) {
    return total > 0 ? ' class="has-value"' : '';
}

consoleProxy.registerListener(function(details) {
    // if we can render the data do so, otherwise save for later
    if (state.ready) {
        updateBrowser(details);
    }
    else {
        state.preRenderCache.push(function() {
            updateBrowser(details);
        });
    }
});

module.exports = {
    render: function() {
        return `
            <div class="glimpse-section glimpse-logs" id="glimpse-logs">
                <div class="glimpse-section-summary" id="glimpse-logs-summary">
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">
                            Logs
                        </div>
                        <div class="glimpse-hud-field-value" id="glimpse-logs-count">
                            --
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    postRender: function() {
        state.ready = true;

        // run through the browser logs if we have any
        updateView(state.data.browser, 'glimpse-logs-popup-browser-value');
        state.preRenderCache.forEach(function(doTask) {
            doTask();
        });
        state.preRenderCache = undefined;

        // when request summary is ready run through the server logs if we have any
        summaryRepository.getPromise().then(function(requestDetails) {
            updateServer(requestDetails);
        });
    },
    renderPopup: function() {
        return `
            <div class="glimpse-hud-popup-section glimpse-logs">
                <div class="glimpse-hud-field">
                    <div class="glimpse-hud-field-label">
                        Logs
                    </div>
                    <div class="glimpse-hud-field-value" id="glimpse-logs-popup-summary-value">
                        --
                    </div>
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">
                            Server logs
                        </div>
                        <div class="glimpse-hud-field-value" id="glimpse-logs-popup-server-value">
                            --
                        </div>
                    </div>
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">
                            Browser logs
                        </div>
                        <div class="glimpse-hud-field-value" id="glimpse-logs-popup-browser-value">
                            --
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
