'use strict';

// DEV TIME CODE
if (FAKE_SERVER) {
    require('fake');
}
// DEV TIME CODE

require('./index.scss');

var versionView = require('./views/version');
var openView = require('./views/open');
var timingView = require('./views/timing');

function renderHud(pageLoadTime) {
    const versionIcon = versionView.render();
    const openIcon = openView.render();
    const timingComponent = timingView.render();

    return `
        <div class="glimpse-hud">
            ${versionIcon}
            ${openIcon}
            ${timingComponent}
        </div>
    `;
}

let timeout = 1;
const onTimeout = () => {
    if (document.readyState === 'complete') {
        const container = document.createElement('div');
        container.innerHTML = renderHud();
        document.body.appendChild(container);
    }
    else {
        setTimeout(onTimeout, timeout *= 2);
    }
}

setTimeout(onTimeout);
