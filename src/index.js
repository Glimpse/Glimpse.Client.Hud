'use strict';

// DEV TIME CODE
if (FAKE_SERVER) {
    require('fake');
}
// DEV TIME CODE

require('./index.scss');

var util = require('lib/util');

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
    // avoid negative values
    return Math.max(0, timingsRaw[finishIndex] - timingsRaw[startIndex]);
};

function getTimings(timingsRaw) {
    let network = calculateTimings(timingsRaw, 'responseStart', 'responseEnd') + calculateTimings(timingsRaw, 'navigationStart', 'requestStart');
    let server = calculateTimings(timingsRaw, 'requestStart', 'responseEnd');
    let browser = calculateTimings(timingsRaw, 'responseStart', 'loadEventEnd');
    let total = calculateTimings(timingsRaw, 'navigationStart', 'loadEventEnd');

    return {
        network,
        server,
        browser,
        total
    };
};

let timeout = 1;
const onTimeout = () => {
    if (document.readyState === 'complete') {
        const timings = getTimings(timingsRaw);
        const container = document.createElement('div');
        container.innerHTML = renderHud(timings.total);
        document.body.appendChild(container);
    }
    else {
        setTimeout(onTimeout, timeout *= 2);
    }
}

setTimeout(onTimeout);
