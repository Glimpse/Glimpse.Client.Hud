const dom = require('../lib/dom');
const summaryRepository = require('../repository/summary');

function processType(summary) {
    return {
        total: summary.totalCount,
        time: Math.round(summary.totalTime)
    };
}
function process(requestSummary) {
    const result = {};
    result.webServices = processType(requestSummary.summary.server.webServices);
    result.dataStore = processType(requestSummary.summary.server.dataStore);
    result.summary = {
        total: result.webServices.total + result.dataStore.total,
        time: result.webServices.time + result.dataStore.time
    };
    return result;
}

function update(model) {
    updateValue('glimpse-data-summary-value', model.summary);
    updateValue('glimpse-data-popup-summary-value', model.summary);
    updateValue('glimpse-data-popup-webServices-value', model.webServices);
    updateValue('glimpse-data-popup-dataStore-value', model.dataStore);
}
function updateValue(target, model) {
    const element = document.getElementById(target);

    let content = model.total;
    if (model.total > 0) {
        dom.addClass(element, 'glimpse-time-ms');

        content += ' / ' + model.time;
    }
    element.innerHTML = content;
}

module.exports = {
    preInit: function(initPromise) {
        Promise.all([
            summaryRepository.getPromise(),
            initPromise
        ]).then(function(values) {
            const requestSummary = values[0];
            const model = process(requestSummary);
            update(model);
        });
    },
    render: function() {
        return `
            <div class="glimpse-section glimpse-data">
                <div class="glimpse-section-summary">
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">
                            Server calls
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
                    <div class="glimpse-hud-field-label">Server calls</div>
                    <div class="glimpse-hud-field-value" id="glimpse-data-popup-summary-value">
                        --
                    </div>
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">Web services</div>
                        <div class="glimpse-hud-field-value" id="glimpse-data-popup-webServices-value">
                            --
                        </div>
                    </div>
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">Data acces</div>
                        <div class="glimpse-hud-field-value" id="glimpse-data-popup-dataStore-value">
                            --
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
