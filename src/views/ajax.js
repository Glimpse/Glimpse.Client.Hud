const util = require('../lib/util');
const dom = require('../lib/dom');

let count = 0;
let ready = false;
let preRenderCache = [];
let currentTimout = undefined;
const summaryStack = [];

function rowTemplate(method, uri, duration) {
    return `
        <div class="glimpse-ajax-row">
            <span class="glimpse-section-label">${method}</span>
            <span class="glimpse-ajax-uri" title="${uri}">${uri}</span>
            <span>
                <span>${duration}</span>
                <span class="glimpse-section-label">ms</span>
            </span>
        </div>
    `;
}

function update(method, uri, duration, size, status, statusText, time, contentType, requestId) {
    count++;

    //manage counter value
    var counter = document.getElementById('glimpse-ajax-count');
    counter.innerText = count;
    dom.addClass(counter, 'glimpse-section-value--update');
    if (currentTimout) {
        clearTimeout(currentTimout);
    }
    currentTimout = setTimeout(function() {
        dom.removeClass(counter, 'glimpse-section-value--update');
    }, 2000);

    //manage row values
    if (summaryStack.length === 0) {
        var section = document.getElementById('glimpse-ajax');
        section.insertAdjacentHTML('beforeend', '<div class="glimpse-ajax-rows" id="glimpse-ajax-rows"></div>');
    }
    recordItem(rowTemplate(method, uri, duration), document.getElementById('glimpse-ajax-rows'), summaryStack, 2);
}
var recordItem = function(html, container, stack, length) {
    //set row
    const newRow = dom.createElement(html);
    container.insertBefore(newRow, container.childNodes[0]);
    setTimeout(function() {
        dom.addClass(newRow, 'glimpse-ajax-row--added');
    }, 1);

    //track state of the details
    if (stack.length >= length) {
        const oldRow = stack.shift()
        oldRow.parentNode.removeChild(oldRow);
    }
    stack.push(newRow);
};

const open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, uri) {
    if (util.isLocalUri(uri) && uri.indexOf('/glimpse/') == -1) {
        const startTime = new Date().getTime();
        this.addEventListener('readystatechange', function() {
            if (this.readyState == 4 && this.getResponseHeader('X-Glimpse-ContextId')) {
                // if we can render the data do so, otherwise save for later
                if (ready) {
                    listenerNotification(method, uri, startTime, this);
                }
                else {
                    const xhrObj = this;
                    preRenderCache.push(function() {
                        listenerNotification(method, uri, startTime, xhrObj);
                    });
                }
            }
        }, false);
    }

    open.apply(this, arguments);
};

function listenerNotification(method, uri, startTime, xhrObj) {
    update(method, uri, new Date().getTime() - startTime, xhrObj.getResponseHeader('Content-Length'), xhrObj.status, xhrObj.statusText, new Date(), xhrObj.getResponseHeader('Content-Type'), xhrObj.getResponseHeader('X-Glimpse-ContextId'));
}

module.exports = {
    render: function() {
        return `
            <div class="glimpse-section glimpse-ajax" id="glimpse-ajax">
                <span class="glimpse-section-label">
                    Ajax requests
                </span>
                <span class="glimpse-section-duration glimpse-section-value" id="glimpse-ajax-count">
                    ${count}
                </span>
                <span class="glimpse-section-suffix glimpse-section-suffix--text">
                    found
                </span>
            </div>
        `;
    },
    postRender: function() {
        ready = true;

        preRenderCache.forEach(function(task) {
            task();
        });

        preRenderCache = undefined;
    }
};
