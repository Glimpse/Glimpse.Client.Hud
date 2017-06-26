const dom = require('../lib/dom');
const summaryRepository = require('../repository/summary');
const icons = require('../assets/icons').default;

const supportedStatusCodes = [ '200', '400', '500' ];
const supportedOperationCategories = [ 'Create', 'Read', 'Update', 'Delete', 'Other' ];

function processType(summary) {
    return {
        total: summary.totalCount,
        time: Math.round(summary.totalTime)
    };
}
function process(requestSummary) {
    const webServicesData = requestSummary.summary.server.webServices;
    const dataStoreData = requestSummary.summary.server.dataStore;

    // summary
    const result = {};
    result.webServices = processType(webServicesData);
    result.dataStore = processType(dataStoreData);
    result.summary = {
        total: result.webServices.total + result.dataStore.total,
        time: result.webServices.time + result.dataStore.time
    };

    // web services
    const statusCodes = result.webServices.statusCodes = {};
    webServicesData.listing.forEach(function(item) {
        const statusCodeGroup = (parseInt(item.statusCode / 100) * 100).toString();
        if (!statusCodes[statusCodeGroup]) {
            statusCodes[statusCodeGroup] = 0;
        }
        statusCodes[statusCodeGroup]++;
    });

    // data store
    const operationCategories = result.dataStore.operationCategories = {};
    dataStoreData.listing.forEach(function(item) {
        const operationCategory = item.operationCategory.toLowerCase();
        if (!operationCategories[operationCategory]) {
            operationCategories[operationCategory] = 0;
        }
        operationCategories[operationCategory]++;
    });

    return result;
}

function update(model) {
    updateValue('glimpse-data-summary-value', model.summary);
    updateValue('glimpse-data-popup-summary-value', model.summary);
    updateValue('glimpse-data-popup-webServices-value', model.webServices);
    updateValue('glimpse-data-popup-dataStore-value', model.dataStore);

    updateListingWebServices('glimpse-data-popup-webServices-subvalue', model.webServices.statusCodes);
    updateListingDataStore('glimpse-data-popup-dataStore-subvalue', model.dataStore.operationCategories);
}
function updateValue(target, summary) {
    const element = document.getElementById(target);

    let content = summary.total;
    if (summary.total > 0) {
        dom.addClass(element, 'glimpse-time-ms');

        content += ' / ' + summary.time;
    }
    element.innerHTML = content;
}
function updateListingWebServices(target, statusCodes) {
    updateCoreListing(target, Object.assign({}, statusCodes), supportedStatusCodes, 's');
}
function updateListingDataStore(target, operationCategories) {
    updateCoreListing(target, Object.assign({}, operationCategories), supportedOperationCategories, '');
}
function updateCoreListing(target, data, supportedRecords, postfix) {
    // run through supported status codes so order is maintained
    let content = '';
    supportedRecords.forEach(function(record) {
        const recordLower = record.toLowerCase();
        if (data[recordLower]) {
            content += `<span>${record}${postfix} (${data[recordLower]})</span>`;
            delete data[recordLower];
        }
    });

    // process the remaining items
    const otherCount = Object.keys(data)
        .reduce((acc, key) => acc + data[key], 0);

    if (otherCount > 0) {
        content += `<span>Others (${otherCount})</span>`;
    }

    const targetElement = document.getElementById(target);
    if (content.length > 0) {
        targetElement.innerHTML = `${content}<div></div>`;
    }
    else {
        targetElement.remove();
    }
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
                    <div class="glimpse-hud-field-label">
                        ${icons.server}
                        Server calls
                    </div>
                    <div class="glimpse-hud-field-value" id="glimpse-data-popup-summary-value">
                        --
                    </div>
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">Web services</div>
                        <div class="glimpse-hud-field-value" id="glimpse-data-popup-webServices-value">
                            --
                        </div>
                        <div class="glimpse-hud-field-listing" id="glimpse-data-popup-webServices-subvalue"></div>
                    </div>
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">Data access</div>
                        <div class="glimpse-hud-field-value" id="glimpse-data-popup-dataStore-value">
                            --
                        </div>
                        <div class="glimpse-hud-field-listing" id="glimpse-data-popup-dataStore-subvalue"></div>
                    </div>
                </div>
            </div>
        `;
    }
};
