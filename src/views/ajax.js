const util = require('../lib/util');
const dom = require('../lib/dom');

const ajaxProxy = require('../proxy/ajax');

let count = 0;
let ready = false;
let preRenderCache = [];
let currentTimout = undefined;
const summaryStack = [];

function rowTemplate(details) {
    return `
        <div class="glimpse-ajax-row">
            <span class="glimpse-section-label">${details.method}</span>
            <span class="glimpse-ajax-uri" title="${details.uri}">${details.uri}</span>
            <span>
                <span>${details.duration}</span>
                <span class="glimpse-section-label">ms</span>
            </span>
        </div>
    `;
}

function update(details) {
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
    recordItem(rowTemplate(details), document.getElementById('glimpse-ajax-rows'), summaryStack, 2);
}
var recordItem = function(html, container, stack, length) {
    //add row to container
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

ajaxProxy.registerListener(function(details) {
    // if we can render the data do so, otherwise save for later
    if (ready) {
        update(details);
    }
    else {
        preRenderCache.push(function() {
            update(details);
        });
    }
});

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
