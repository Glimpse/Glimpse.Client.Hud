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

module.exports = {
    getTimings: function(callback) {
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
};
