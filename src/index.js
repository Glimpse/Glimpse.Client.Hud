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

function render() {
    const versionComponent = versionView.render();
    const openComponent = openView.render();
    const timingComponent = timingView.render();
    const ajaxComponent = ajaxView.render();

    return `
        <div class="glimpse-hud">
            ${versionComponent}
            ${timingComponent}
            ${ajaxComponent}
            ${openComponent}
        </div>
    `;
}

function postRender() {
    ajaxView.postRender();
}

let timeout = 1;
const onTimeout = () => {
    if (document.readyState === 'complete') {
        const container = document.createElement('div');
        container.innerHTML = render();
        document.body.appendChild(container);

        postRender();
    }
    else {
        setTimeout(onTimeout, timeout *= 2);
    }
}

setTimeout(onTimeout);
