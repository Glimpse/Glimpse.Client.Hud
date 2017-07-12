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
var expandButtonView = require('./views/expand-button-view');
var util = require('./lib/util');

const state = {
    expanded: util.localGet('expanded', false)
};

function render(state) {
    return `
        <div class="glimpse-hud">
            <div class="glimpse-hud-data" data-glimpse-expanded="${state.expanded}">
                ${versionView.render()}
                ${expandButtonView.render()}
                ${timingView.render()}
                ${logsView.render()}
                ${dataView.render()}
                ${ajaxView.render()}
                <div class="glimpse-hud-popup">
                    ${expandButtonView.renderPopup()}
                    ${timingView.renderPopup()}
                    ${logsView.renderPopup()}
                    ${dataView.renderPopup()}
                    ${ajaxView.renderPopup()}
                </div>
            </div>
            ${openView.render()}
        </div>
    `;
}

function postRender() {
    var hudData = document.querySelector('.glimpse-hud-data');
    var expandButton = document.querySelector('#js-glimpse-expand-button');
    var collapseButton = document.querySelector('#js-glimpse-collapse-button');

    if (!hudData) {
        // element does not exist yet
        return;
    }

    ajaxView.postRender();
    logsView.postRender();

    var setOpenState = function(panelState) {
      util.localSet(state, 'expanded', panelState, function() {
          hudData.setAttribute('data-glimpse-expanded', panelState);
      });
    };

    expandButton.addEventListener('click', function() { setOpenState(true); });
    collapseButton.addEventListener('click', function() { setOpenState(false); });
}

function preInit(initPromise) {
    dataView.preInit(initPromise);
}

function init() {
    // setup init promise
    const promise = new Promise(function(resolve, reject) {
        let timeout = 1;
        const onTimeout = function() {
            if (document.readyState === 'complete') {
                // allow components to provide content which they want to be shown in initial render
                const content = render(state);

                const container = document.createElement('div');
                container.innerHTML = content;
                document.body.appendChild(container);

                // allow components hook post HUD being inserted into the dom
                postRender();

                // resolves the promise and pass through the container for future usage
                resolve(container);
            }
            else {
                setTimeout(onTimeout, timeout *= 2);
            }
        }

        setTimeout(onTimeout);
    });

    // allow components hook before any other hud logic running
    preInit(promise);
}

init();
