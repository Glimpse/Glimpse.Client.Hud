const timingsRaw = (window.performance ||
    window.mozPerformanceperformance ||
    window.msPerformanceperformance ||
    window.webkitPerformanceperformance ||
    {}).timing;
let timingIncomplete = false;

function calculateTimings(timingsRaw, startIndex, finishIndex) {
  // avoid negative values
  return Math.max(0, timingsRaw[finishIndex] - timingsRaw[startIndex]);
}

function getTimings(timingsRaw) {
    let network =
        calculateTimings(timingsRaw, 'responseStart', 'responseEnd') +
        calculateTimings(timingsRaw, 'navigationStart', 'requestStart');
    let server = calculateTimings(timingsRaw, 'requestStart', 'responseEnd');
    let browser = calculateTimings(timingsRaw, 'responseStart', 'loadEventEnd');
    let total = calculateTimings(timingsRaw, 'navigationStart', 'loadEventEnd');

    return {
        network,
        server,
        browser,
        total
    };
}

module.exports = {
    render: function() {
        const timings = getTimings(timingsRaw);

        return `
            <div class="glimpse-section glimpse-section--first glimpse-timing">
                <span class="glimpse-section-label">
                    Page load time
                </span>
                <span class="glimpse-section-duration glimpse-section-value">
                    ${timings.total}
                </span>
                <span class="glimpse-section-suffix">
                    ms
                </span>
            </div>
        `;
    }
};
