'use strict';

// DEV TIME CODE
if (FAKE_SERVER) {
    require('fake');
}
// DEV TIME CODE

require('./index.scss');

var util = require('lib/util');

function renderHud(pageLoadTime) {
    const url = util.resolveClientUrl(util.currentRequestId(), true);
    const arrow = `
        <svg class="glimpse-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
            <path class="glimpse-arrow-path" d="M1022,2H2046V1026H1918V221L91,2047,1,1957,1827,130H1022V2Z"/>
        </svg>
    `;
    const icon = `
    <svg width="51px" height="42px" viewBox="0 0 51 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <path d="M18.9063499,1.05722368 C12.5966832,3.59438196 6.1474088,6.16719385 0.730663783,8.33323651 C0.315507095,8.41927909 -0.00862495403,8.82611248 0.000175011095,9.24989955 L0.000175011095,32.1664662 C-0.00440830407,32.562098 0.279344738,32.9432007 0.659026567,33.0544835 C6.9629639,35.8745057 13.3576052,38.7621776 18.7487755,41.189868 C19.0639697,41.3648131 19.4810972,41.3850714 19.780021,41.1756597 L25.1654163,38.7551193 L38.5000218,33.0544835 L38.5000218,9.24999121 C38.5050634,8.83859743 38.198073,8.44407941 37.7982246,8.34765104 L19.6081467,1.07163821 C19.4851305,1.01717467 19.3571185,0.999249327 19.2357981,1.00002391 C19.1143403,1.0008489 18.9996199,1.02014466 18.9063499,1.05722368 Z M19.2500064,2.89054975 L35.1054352,9.23557669 L28.4167284,11.9139515 L12.5613,5.58324741 L19.2500981,2.89054975 L19.2500064,2.89054975 Z M10.0833765,6.57152474 L25.9388966,12.9165517 L19.2500981,15.5806036 L3.39466989,9.24989955 L10.0834682,6.57152474 L10.0833765,6.57152474 Z M1.83340941,10.5962484 L18.3333438,17.1990868 L18.3333438,38.9841475 L1.83340941,31.5649061 L1.83340941,10.5962484 L1.83340941,10.5962484 Z M36.6666041,31.9137618 L20.1667611,38.9841475 L20.1667611,17.1990868 L27.5000654,14.2629005 L27.5000654,20.2498468 C27.4931904,20.7341199 27.9324095,21.1808098 28.4167284,21.1808098 C28.9010473,21.1808098 29.3402206,20.7341199 29.3333915,20.2498468 L29.3333915,13.5324347 L36.6666957,10.5962484 L36.6666041,31.9137618 Z" id="Shape" fill="#FFFFFF" fill-rule="nonzero"></path>
            <g transform="translate(26.260870, 18.400000)">
                <polygon id="Path-4" fill="#FFFFFF" points="11.4303847 19.6757008 5.91851402 10.5149814 10.5113344 1.8885512 16.6590031 6.53607695 13.4769737 18.3639874"></polygon>
                <path d="M22.7315288,15.3063114 L15.0082884,1.9292865 C14.3213719,0.739588847 13.0411301,0 11.667297,0 C10.2938993,0 9.01409278,0.739153539 8.32674093,1.9288512 L0.514697696,15.4591046 C-0.171783536,16.648367 -0.171348227,18.1271093 0.514697696,19.3155011 C1.20204954,20.5047634 2.48185602,21.2447876 3.8556891,21.2447876 L19.4828227,21.2447876 L19.5159062,21.2447876 C21.6284575,21.2278106 23.3409604,19.5035543 23.3409604,17.3883911 C23.3413957,16.6453198 23.1302712,15.9279317 22.7315288,15.3063114 Z M11.6703442,4.76488494 C12.3285304,4.76488494 12.8622184,5.29813765 12.8622184,5.95632384 L12.5579379,13.0657794 C12.5274663,13.7087298 12.027297,13.9533731 11.6703442,13.9533731 C11.2702958,13.9533731 10.8180105,13.7422486 10.7827505,13.0657794 L10.4780347,5.95632384 C10.47847,5.29813765 11.012158,4.76488494 11.6703442,4.76488494 Z M12.7459911,17.5577261 C12.4630406,17.8406765 12.0721338,18.0026112 11.6703442,18.0026112 C11.2681193,18.0026112 10.8776477,17.8406765 10.5916502,17.5577261 C10.3082644,17.2747756 10.146765,16.8812569 10.146765,16.479032 C10.146765,16.0798543 10.3082644,15.6872062 10.5916502,15.4029498 C10.8776477,15.1199994 11.2711665,14.9554529 11.6703442,14.9554529 C12.0699572,14.9554529 12.4626053,15.1199994 12.7459911,15.4029498 C13.0324239,15.6867709 13.1939233,16.0798543 13.1939233,16.479032 C13.1939233,16.8812569 13.0324239,17.2743403 12.7459911,17.5577261 Z" id="Shape" fill="#D0011B" fill-rule="nonzero"></path>
            </g>
        </g>
    </svg>
    `;
    let newVersion;
    try {
        const updateInfo = JSON.parse(localStorage.getItem('glimpseLatestVersion'));
        if (updateInfo.latestVersion && updateInfo.latestVersion !== updateInfo.atTimeOfCheckVersion) {
            newVersion = updateInfo.latestVersion;
        }
    } catch (e) {
        // gulp
    }

    const newVersionIcon = newVersion
        ? `<a class="glimpse-icon" title="New version available: ${newVersion}" href="#">${icon}</a>`
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
