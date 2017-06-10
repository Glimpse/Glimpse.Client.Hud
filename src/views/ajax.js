const util = require('../lib/util');
const dom = require('../lib/dom');

const ajaxProxy = require('../proxy/ajax');

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
        length: -6
    }
};

function processContentType(type) {
    return type ? type.substring(0, type.indexOf(';')) : '--';
};
function processSize(size) {
    return size ? (Math.round((size / 1024) * 10) / 10) : '--';
}

function rowTemplate(request) {
    return `
        <tr class="glimpse-ajax-row">
            <td class="glimpse-ajax-cell glimpse-section-label">
                ${request.method}
            </td>
            <td class="glimpse-ajax-cell glimpse-ajax-uri" title="${request.uri}">
                ${request.uri}
            </td>
            <td class="glimpse-ajax-cell">
                <span class="glimpse-time-ms">${request.duration}</span>
            </td>
        </tr>
    `;
}
function rowPopupTemplate(request) {
    const url = util.resolveClientUrl(request.requestId, false);

    return `
        <tr class="glimpse-ajax-row">
            <td title="${request.uri}" colspan="2"><a href="${url}">${request.uri}</a></td>
            <td class="glimpse-time-ms">${request.duration}</td>
            <td class="glimpse-size-kb">${processSize(request.size)}</td>
        </tr>
        <tr class="glimpse-ajax-row">
            <td class="glimpse-label">${request.method}</td>
            <td>${request.status} - ${request.statusText}</td>
            <td title="${request.contentType}">${processContentType(request.contentType)}</td>
            <td>${request.time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')}</td>
        </tr>
    `;
}

function update(request) {
    state.count++;

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
                    <span class="glimpse-label">
                        Ajax requests
                    </span>
                    <span class="glimpse-section-value" id="glimpse-ajax-count">
                        ${state.count}
                    </span>
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
                    <div class="glimpse-hud-field-label">
                        AJAX requests
                    </div>
                    <div class="glimpse-hud-field-value" id="glimpse-ajax-popup-count">
                        ${state.count}
                    </div>
                </div>
                <table class="glimpse-ajax-rows" id="glimpse-ajax-popup-rows">
                </table>
            </div>
        `;
    }
};
