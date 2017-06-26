// DEV TIME CODE
if (FAKE_SERVER) {
    require('fake');
}
// DEV TIME CODE
require('./index.scss');

var summaryRepository = require('./repository/summary');
var versionView = require('./views/version');
var openView = require('./views/open');
var timingView = require('./views/timing');
var ajaxView = require('./views/ajax');
var dataView = require('./views/data');
var logsView = require('./views/logs');
var util = require('./lib/util');

const state = {
    expanded: util.localGet('expanded', false)
};

function render(state) {
    return `
        <div class="glimpse-hud">
            <div class="glimpse-hud-data" data-glimpse-expanded="${state.expanded}">
                ${versionView.render()}
                ${timingView.render()}
                ${dataView.render()}
                ${ajaxView.render()}
                ${logsView.render()}
                <div class="glimpse-hud-popup">
                    ${timingView.renderPopup()}
                    ${dataView.renderPopup()}
                    ${ajaxView.renderPopup()}
                    ${logsView.renderPopup()}
                </div>
            </div>
            ${openView.render()}
        </div>
    `;
}

function postRender(initPromise) {
    ajaxView.postRender(initPromise);
    logsView.postRender(initPromise)

    var hudData = document.querySelector('.glimpse-hud-data');

    hudData.addEventListener('click', function() {
        util.localSet(state, 'expanded', !state.expanded, function() {
            hudData.setAttribute('data-glimpse-expanded', state.expanded);
        });
    });
}

function preInit(initPromise) {
    dataView.preInit(initPromise);
}

const init = new Promise(function(resolve, reject) {
    // allow components hook before any other hud logic running
    preInit(init);

    let timeout = 1;
    const onTimeout = function() {
        if (document.readyState === 'complete') {
            // allow components to provide content which they want to be shown in initial render
            const content = render(state);

            const container = document.createElement('div');
            container.innerHTML = content;
            document.body.appendChild(container);

            // allow components hook post HUD being inserted into the dom
            postRender(init);

            // resolves the promise and pass through the container for future usage
            resolve(container);
        }
        else {
            setTimeout(onTimeout, timeout *= 2);
        }
    }

    setTimeout(onTimeout);
});
