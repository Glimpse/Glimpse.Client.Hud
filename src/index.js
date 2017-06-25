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

function render(initPromise) {
    return `
        <div class="glimpse-hud">
            <div class="glimpse-hud-data">
                ${versionView.render()}
                ${timingView.render()}
                ${dataView.render()}
                ${ajaxView.render()}
                <div class="glimpse-hud-popup">
                    ${timingView.renderPopup()}
                    ${dataView.renderPopup()}
                    ${ajaxView.renderPopup()}
                </div>
            </div>
            ${openView.render()}
        </div>
    `;
}

function postRender(initPromise) {
    ajaxView.postRender(initPromise);
}

function preInit(initPromise) {
    dataView.preInit(initPromise);
}

const init = new Promise(function(resolve, reject) {
    // allow components hook before any other hud logic running
    preInit(init);

    let timeout = 1;
    const onTimeout = () => {
        if (document.readyState === 'complete') {
            // allow components to provide content which they want to be shown in initial render
            const content = render(init);

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
