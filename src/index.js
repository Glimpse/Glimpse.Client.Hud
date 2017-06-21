// DEV TIME CODE
if (FAKE_SERVER) {
    require('fake');
}
// DEV TIME CODE

require('./index.scss');

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
    preInit(init);

    let timeout = 1;
    const onTimeout = () => {
        if (document.readyState === 'complete') {
            const container = document.createElement('div');
            container.innerHTML = render(init);
            document.body.appendChild(container);

            postRender(init);

            resolve(container);
        }
        else {
            setTimeout(onTimeout, timeout *= 2);
        }
    }

    setTimeout(onTimeout);
});
