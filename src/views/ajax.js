const util = require('../lib/util');
const ajaxProxy = require('../proxy/ajax');
const dom = require('../lib/dom');
const arrowIcon = require('./open').arrowIcon;

const state = {
    count: 0,
    ready: false,
    preRenderCache: [],
    summary: {
        countId: 'glimpse-ajax-count',
        rowsId: 'glimpse-ajax-rows',
        timeout: undefined,
        stack: [],
        template: rowTemplate,
        length: -1
    },
    popup: {
        countId: 'glimpse-ajax-popup-count',
        rowsId: 'glimpse-ajax-popup-rows',
        timeout: undefined,
        stack: [],
        template: rowPopupTemplate,
        length: -3
    }
};

function processContentType(type) {
    return type || '--';
};
function processSize(size) {
    return size ? (Math.round((size / 1024) * 10) / 10) : '--';
}

function rowTemplate(request) {
    const url = util.resolveClientUrl(request.requestId, false);

    return `
        <tr class="glimpse-ajax-row">
            <td class="glimpse-ajax-cell glimpse-section-label">
                ${request.method}
            </td>
            <td class="glimpse-ajax-cell glimpse-ajax-uri" title="${request.uri}">
                <a class="glimpse-anchor" href="${url}" target="_glimpse" title="Open '${request.uri}' in Glimpse">${arrowIcon}</a> ${request.uri}
            </td>
            <td class="glimpse-ajax-cell" data-glimpse-type="duration">
                <span class="glimpse-time-ms">${request.duration}</span>
            </td>
        </tr>
    `;
}
function rowPopupTemplate(request) {
    const url = util.resolveClientUrl(request.requestId, false);

    return `
        <tr class="glimpse-ajax-row">
            <td class="glimpse-ajax-cell" title="${request.uri}" colspan="2">
                <a class="glimpse-anchor" href="${url}" target="_glimpse" title="Open '${request.uri}' in Glimpse">${arrowIcon}</a> ${request.uri}
            </td>
            <td class="glimpse-ajax-cell glimpse-time-ms" data-glimpse-type="duration">
                ${request.duration}
            </td>
            <td class="glimpse-ajax-cell glimpse-size-kb" data-glimpse-type="size">
                ${processSize(request.size)}
            </td>
        </tr>
        <tr class="glimpse-ajax-row">
            <td class="glimpse-ajax-cell glimpse-label" data-glimpse-type="method">${request.method}</td>
            <td class="glimpse-ajax-cell" data-glimpse-type="status">${request.status} - ${request.statusText}</td>
            <td class="glimpse-ajax-cell" title="${request.contentType}" data-glimpse-type="content-type">${processContentType(request.contentType)}</td>
            <td class="glimpse-ajax-cell" data-glimpse-type="time">${request.time
                .toTimeString()
                .replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')}</td>
        </tr>
    `;
}

function update(request) {
    state.count++;

    dom.removeClass(document.getElementById('glimpse-ajax-popup-list'), 'glimpse-ajax-rows--hidden');

    updateCounter(state.summary, state.count);
    updateCounter(state.popup, state.count);

    updateView(state.summary, request);
    updateView(state.popup, request);
}
function updateCounter(details, count) {
    var counter = document.getElementById(details.countId);
    counter.innerText = count;
    dom.addClass(counter, 'glimpse-section-value--update');
    if (details.timeout) {
        clearTimeout(details.timeout);
    }
    details.timeout = setTimeout(function() {
        dom.removeClass(counter, 'glimpse-section-value--update');
    }, 2000);
}
function updateView(details, request) {
    details.stack = details.stack
        .slice(details.length)
        .concat(request);
    document.getElementById(details.rowsId).innerHTML = details.stack
        .map(details.template)
        .join('\n');
}

ajaxProxy.registerListener(function(details) {
    // if we can render the data do so, otherwise save for later
    if (state.ready) {
        update(details);
    }
    else {
        state.preRenderCache.push(function() {
            update(details);
        });
    }
});

module.exports = {
    render: function() {
        return `
            <div class="glimpse-section glimpse-ajax" id="glimpse-ajax">
                <div class="glimpse-section-summary" id="glimpse-ajax-summary">
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">
                            Browser calls
                        </div>
                        <div class="glimpse-hud-field-value" id="glimpse-ajax-count">
                            ${state.count}
                        </div>
                    </div>
                    <table class="glimpse-ajax-rows" id="glimpse-ajax-rows"></table>
                </div>
            </div>
        `;
    },
    postRender: function() {
        state.ready = true;

        state.preRenderCache.forEach(function(task) {
            task();
        });
        state.preRenderCache = undefined;
    },
    renderPopup: function() {
        return `
            <div class="glimpse-hud-popup-section -ajax">
                <div class="glimpse-hud-field">
                    <div class="glimpse-hud-field-label" title="Browser service calls (fetch/ajax)">
                        Browser calls
                    </div>
                    <div class="glimpse-hud-field-value" id="glimpse-ajax-popup-count">
                        ${state.count}
                    </div>
                </div>
                <table class="glimpse-ajax-rows glimpse-ajax-rows--hidden" id="glimpse-ajax-popup-list">
                    <thead>
                        <tr>
                            <th class="glimpse-ajax-cell-heading" data-glimpse-type="method"></th>
                            <th class="glimpse-ajax-cell-heading" data-glimpse-type="status"></th>
                            <th class="glimpse-ajax-cell-heading" data-glimpse-type="duration">
                                Duration
                            </th>
                            <th class="glimpse-ajax-cell-heading" data-glimpse-type="size">
                                Size
                            </th>
                        </tr>
                    </thead>
                    <tbody id="glimpse-ajax-popup-rows">
                    </tbody>
                </table>
            </div>
        `;
    }
};
