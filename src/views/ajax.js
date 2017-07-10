const util = require('../lib/util');
const ajaxProxy = require('../proxy/ajax');
const dom = require('../lib/dom');
const arrowIcon = require('./open').arrowIcon;
const icons = require('../assets/icons').default;
const statusIcon = require('../assets/icons').statusIcon;

/**
 * removeOrigin - function to remove origin from a URL.
 *
 * @param {String} url URL to remove the origin from.
 * @param {String} origin Origin to remove from URL.
 */
const removeOrigin = (url = '', origin = window.location.origin) => {
  if (url.substr(0, origin.length) === origin) {
      url = url.substr(origin.length, url.length);
  }

  return url;
};

/**
 * removeOriginFromUrl - function to remove origin from a URL
 *                       reguarding `http` and `https`.
 *
 * @param {String} url URL to remove the origin from.
 * @param {String} origin Origin to remove from URL.
 */
const removeOriginFromUrl = (url = '', origin = window.location.origin) => {
    url = url.trim();
    url = removeOrigin(url, origin);
    // the first call of the `removeOrigin` makes sure that we stip off the
    // origin in case the `url` has it the same but different(`https`) protocol
    // if the protocol is already `https` we use it
    url = removeOrigin(url, origin.replace(/^http\:\/\//, 'https://'));
    // same as above but for `http` protocol case. these two calls cover
    // 4 cases, making sure that we strip the origin regardless
    // of the protocol differences:
    // |--------------------------------|
    // | url protocol | origin protocol |
    // |--------------------------------|
    // | http         | http            |
    // | http         | https           |
    // | https        | http            |
    // | https        | https           |
    // |--------------------------------|
    url = removeOrigin(url, origin.replace(/^https\:\/\//, 'http://'));

    return url;
};

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
        length: -2
    },
    popup: {
        countId: 'glimpse-ajax-popup-count',
        rowsId: 'glimpse-ajax-popup-rows',
        timeout: undefined,
        stack: [],
        template: rowPopupTemplate,
        length: 0
    }
};

function processContentType(type) {
    return type || '--';
};
function processSize(size) {
    return size ? (Math.round((size / 1024) * 10) / 10) : '--';
}

/**
 * getProtocolIcon - function to get icon regarding `URL` protocol.
 *
 * @param  {String} url: URL to get the icon for.
 * @return {String} Icon markup string.
 */
function getProtocolIcon(url: string) {
    return (/https\:\/\//).test(url)
        ? `<span class="glimpse-ajax-uri__icon">${icons.lockIcon}</span>`
        : '';
}

function rowTemplate(request) {
    const url = util.resolveClientUrl(request.requestId, false);
    const uri = removeOriginFromUrl(request.uri);

    return `
        <tr class="glimpse-ajax-row">
            <td class="glimpse-ajax-cell glimpse-section-label">
                ${request.method}
            </td>
            <td class="glimpse-ajax-cell glimpse-ajax-uri" title="${request.uri}">
                <a class="glimpse-anchor" href="${url}" target="_glimpse" title="Open '${request.uri}' in Glimpse">${arrowIcon}</a>
                ${getProtocolIcon(request.uri)} ${uri}
            </td>
            <td class="glimpse-ajax-cell" data-glimpse-type="duration">
                <span class="glimpse-time-ms">${request.duration}</span>
            </td>
        </tr>
    `;
}
function rowPopupTemplate(request) {
    const url = util.resolveClientUrl(request.requestId, false);
    const uri = removeOriginFromUrl(request.uri);

    return `
        <div class="glimpse-ajax-row">
            <div class="glimpse-ajax-row-line">
                <span class="glimpse-ajax-text" data-glimpse-type="uri" title="${request.uri}">
                    <a class="glimpse-anchor" href="${url}" target="_glimpse" title="Open '${request.uri}' in Glimpse">${arrowIcon}</a>
                    <span class="glimpse-ajax-text glimpse-ajax-text--uri" title="${request.uri}">
                        ${getProtocolIcon(request.uri)} ${uri}
                    </span>
                </span>
                <span class="glimpse-ajax-text" data-glimpse-type="time">
                    ${request.time
                        .toTimeString()
                        .replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')}
                </span>
            </div>
            <div class="glimpse-ajax-row-line glimpse-ajax-row-line--secondary">
                <span class="glimpse-ajax-text glimpse-label" data-glimpse-type="method">
                    ${request.method}
                </span>
                <span class="glimpse-ajax-text" data-glimpse-type="status">
                    ${statusIcon(request.status)}
                    ${request.status} - ${request.statusText}
                </span>
                <span class="glimpse-ajax-text glimpse-size-kb" data-glimpse-type="size">
                    ${processSize(request.size)}
                </span>
                <span class="glimpse-ajax-text glimpse-time-ms" data-glimpse-type="duration">
                    ${request.duration}
                </span>
            </div>
        </div>
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
        .reverse()
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

        state.preRenderCache.forEach(function(doTask) {
            doTask();
        });
        state.preRenderCache = undefined;
    },
    renderPopup: function() {
        return `
            <div class="glimpse-hud-popup-section -ajax">
                <div class="glimpse-hud-field">
                    <div class="glimpse-hud-field-label" title="Browser service calls (fetch/ajax)">
                        ${icons.client}
                        Browser calls
                    </div>
                    <div class="glimpse-hud-field-value" id="glimpse-ajax-popup-count">
                        ${state.count}
                    </div>
                </div>
                <div id="glimpse-ajax-popup-rows">
                </div>
            </div>
        `;
    }
};
