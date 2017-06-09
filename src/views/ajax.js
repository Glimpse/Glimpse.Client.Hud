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
            <td class="glimpse-ajax-cell glimpse-section-label">${request.method}</td>
            <td class="glimpse-ajax-cell glimpse-ajax-uri" title="${request.uri}">${request.uri}</td>
            <td class="glimpse-ajax-cell">
                <span>${request.duration}</span>
                <span class="glimpse-section-label">ms</span>
            </td>
        </tr>
    `;
}

function rowPopupTemplate(request) {
    return `
        <tbody>
            <tr>
                <td title="${request.uri}" colspan="2">${request.uri}</td>
                <td>${request.duration}</td>
                <td>${processSize(request.size)}</td>
            </tr>
            <tr>
                <td>${request.method}</td>
                <td>${request.status} - ${request.statusText}</td>
                <td title="${request.contentType}">${processContentType(request.contentType)}</td>
                <td>${request.time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')}</td>
            </tr>
        </tbody>
    `;
}

function update(request) {
    state.count++;

    updateCounter(state.summary);
    updateCounter(state.popup);

    updateView(state.summary, request);
    updateView(state.popup, request);
}

function updateCounter(details) {
    var counter = document.getElementById(details.countId);
    counter.innerText = state.count;
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
                    <span class="glimpse-section-label">
                        Ajax requests
                    </span>
                    <span class="glimpse-section-value" id="glimpse-ajax-count">
                        ${state.count}
                    </span>
                    <table class="glimpse-ajax-rows" id="glimpse-ajax-rows"></table>
                </div>
                <div class="glimpse-section-detail">
                    test<br />
                    test<br />
                    test<br />
                    test<br />
                    test<br />
                    test
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
            <div>
                <span>
                    Ajax requests
                </span>
                <span id="glimpse-ajax-popup-count">
                    ${state.count}
                </span>
                <table id="glimpse-ajax-popup-rows"></table>
            </div>
        `;
    }
};
