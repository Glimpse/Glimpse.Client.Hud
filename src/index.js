'use strict';

// DEV TIME CODE
if (FAKE_SERVER) {
    require('fake');
}
// DEV TIME CODE

require('./index.scss');

var util = require('lib/util');

function getLatestVersion() {
    try {
        const updateInfo = JSON.parse(localStorage.getItem('glimpseLatestVersion'));

        if (updateInfo.latestVersion && updateInfo.latestVersion !== updateInfo.atTimeOfCheckVersion) {
            return updateInfo.latestVersion;
        }
    } catch (e) {
        return false;
    }

    return false;
}

function renderHud(pageLoadTime) {
    const url = util.resolveClientUrl(util.currentRequestId(), true);
    const arrow = `
        <svg class="glimpse-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
            <path class="glimpse-arrow-path" d="M1022,2H2046V1026H1918V221L91,2047,1,1957,1827,130H1022V2Z"/>
        </svg>
    `;
    const icon = `
        <svg viewBox="0 0 51 42" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M18.906 1.057C12.596 3.594 6.146 6.167.73 8.333c-.414.086-.74.493-.73.917v22.916c-.004.396.28.777.66.888 6.303 2.82 12.698 5.708 18.09 8.136.314.175.73.195 1.03-.014l5.385-2.42L38.5 33.053V9.25c.005-.41-.302-.806-.702-.902l-18.19-7.276c-.123-.055-.25-.073-.372-.072-.122 0-.236.02-.33.057zm.344 1.834l15.855 6.346-6.688 2.678-15.856-6.33 6.69-2.693zm-9.167 3.682l15.856 6.345-6.69 2.664L3.395 9.25l6.688-2.678zm-8.25 4.024l16.5 6.603v21.784l-16.5-7.42V10.597zm34.834 21.318l-16.5 7.07V17.2l7.333-2.937v5.987c-.007.484.432.93.917.93.484 0 .923-.446.916-.93v-6.718l7.334-2.936v21.318z" fill="#FFF" fill-rule="nonzero"/><path fill="#FFF" d="M37.69 38.076l-5.51-9.16 4.592-8.627 6.148 4.646-3.182 11.828"/><path d="M48.992 33.706L41.27 20.33c-.688-1.19-1.968-1.93-3.342-1.93-1.373 0-2.653.74-3.34 1.93l-7.812 13.53c-.687 1.188-.686 2.667 0 3.856.687 1.19 1.967 1.93 3.34 1.93h15.661c2.112-.018 3.825-1.742 3.825-3.858 0-.743-.21-1.46-.61-2.082zm-11.06-10.54c.657 0 1.19.532 1.19 1.19l-.303 7.11c-.032.643-.532.887-.89.887-.4 0-.85-.21-.886-.887l-.305-7.11c0-.658.533-1.19 1.19-1.19zm1.075 12.792c-.283.283-.674.445-1.076.445-.4 0-.79-.162-1.077-.445-.284-.283-.445-.677-.445-1.08 0-.398.16-.79.445-1.075.286-.283.68-.448 1.078-.448.4 0 .793.165 1.077.448.286.284.448.677.448 1.076 0 .4-.162.794-.448 1.078z" fill="#D0011B" fill-rule="nonzero"/></g></svg>
    `;
    const newVersion = getLatestVersion();

    const newVersionIcon = newVersion
        ? `<a class="glimpse-icon" title="New version available: ${newVersion}" href="https://www.npmjs.com/package/@glimpse/glimpse" target="_blank">${icon}</a>`
        : '';

    return `
        <div class="glimpse-hud">
            ${newVersionIcon}
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
