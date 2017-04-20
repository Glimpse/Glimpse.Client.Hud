'use strict';

// DEV TIME CODE
if (FAKE_SERVER) {
    require('fake');
}
// DEV TIME CODE

require('./index.scss');

var util = require('lib/util');
var repository = require('./repository');

function renderHud(pageLoadTime) {
    var url = util.resolveClientUrl(util.currentRequestId(), true);
    var arrow = `
        <svg class="glimpse-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
            <path class="glimpse-arrow-path" d="M1022,2H2046V1026H1918V221L91,2047,1,1957,1827,130H1022V2Z"/>
        </svg>
    `;

    return `
        <div class="glimpse-hud">
            <a target="_glimpse" href="${url}" class="glimpse-link">
                ${arrow}
                <span>Open in Glimpse</span>
            </a>
            <div class="glimpse-timing">
                <span class="glimpse-timing-label">
                    Page load time
                </span>
                <span class="glimpse-timing-duration">
                    ${pageLoadTime}
                </span>
                <span class="glimpse-timing-suffix">
                    ms
                </span>
            </div>
        </div>
    `;
}

const timingsRaw = (window.performance
    || window.mozPerformanceperformance
    || window.msPerformanceperformance
    || window.webkitPerformanceperformance
    || {}).timing;
let timingIncomplete = false;

function calculateTimings(timingsRaw, startIndex, finishIndex) { 
    return timingsRaw[finishIndex] - timingsRaw[startIndex];
};

function getTimings(details, timingsRaw) {
    var network = calculateTimings(timingsRaw, 'responseStart', 'responseEnd') + calculateTimings(timingsRaw, 'navigationStart', 'requestStart'),
        server = calculateTimings(timingsRaw, 'requestStart', 'responseEnd'),
        browser = calculateTimings(timingsRaw, 'responseStart', 'loadEventEnd'),
        total = calculateTimings(timingsRaw, 'navigationStart', 'loadEventEnd');

    // trying to avoid negitive values showing up
    if (server <= 0) {
        server = parseInt(details.request.data.responseDuration);
    }
    if (network < 0 || browser < 0) {
        if (network < 0) {
            network = 0;
        }
        if (browser < 0) {
            browser = 0;
        }
        timingIncomplete = true;
    }
    else {
        timingIncomplete = false;
    }

    return { network: network, server: server, browser: browser, total: total };
};

// only load things when we have the data ready to go
repository.getData().then(function (details) {
    // set a timeout to render the hud. We'll do exponential backoff on the timer until the document is ready.
    let timeout = 1;

    const onTimeout = () => {
        if (document.readyState === 'complete') {
            const timings = getTimings(details, timingsRaw);
            const container = document.createElement('div');
            container.innerHTML = renderHud(timings.total);
            document.body.appendChild(container);
        }
        else {
            timeout *= 2;
            setTimeout(onTimeout, timeout);
        }
    }

    setTimeout(onTimeout, 0);
});
