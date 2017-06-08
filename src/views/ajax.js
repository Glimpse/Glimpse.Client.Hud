const util = require('../lib/util');
const dom = require('../lib/dom');

const ajaxProxy = require('../proxy/ajax');

const state = {
    count: 0,
    ready: false,
    preRenderCache: [],
    currentTimeout: undefined,
    summaryStack: []
};

function rowTemplate(details) {
    return `
        <tr class="glimpse-ajax-row">
            <td class="glimpse-ajax-cell glimpse-section-label">${details.method}</td>
            <td class="glimpse-ajax-cell glimpse-ajax-uri" title="${details.uri}">${details.uri}</td>
            <td class="glimpse-ajax-cell">
                <span>${details.duration}</span>
                <span class="glimpse-section-label">ms</span>
            </td>
        </tr>
    `;
}

function update(details) {
    state.count++;

    //manage counter value
    var counter = document.getElementById('glimpse-ajax-count');
    counter.innerText = state.count;
    dom.addClass(counter, 'glimpse-section-value--update');
    if (state.currentTimout) {
        clearTimeout(state.currentTimout);
    }
    state.currentTimout = setTimeout(function() {
        dom.removeClass(counter, 'glimpse-section-value--update');
    }, 2000);

    state.summaryStack.push(details);

    document.getElementById('glimpse-ajax-rows').innerHTML = state.summaryStack
        .slice(-2)
        .map(rowTemplate)
        .join('\n');
}
function recordItem(html, container, stack, length) {
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
                    <span class="glimpse-section-duration glimpse-section-value" id="glimpse-ajax-count">
                        ${state.count}
                    </span>
                    <span class="glimpse-section-suffix glimpse-section-suffix--text">
                        found
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
    }
};
