const timingsRaw = (window.performance ||
    window.mozPerformanceperformance ||
    window.msPerformanceperformance ||
    window.webkitPerformanceperformance ||
    {}).timing;
let timings = undefined;

function normalizeTotal(value) {
    // avoid negative values
    return Math.max(0, value);
}

module.exports = {
    getTimings: function(callback) {
        if (!timings) {
            const pageLoad = normalizeTotal(timingsRaw.loadEventEnd - timingsRaw.navigationStart);
            const networkConnection = normalizeTotal(timingsRaw.connectEnd - (timingsRaw.redirectStart || timingsRaw.fetchStart));
            const sendingRequest = normalizeTotal(timingsRaw.responseStart - timingsRaw.requestStart);
            const receivingResponse = normalizeTotal(timingsRaw.responseEnd - timingsRaw.responseStart);
            const browserProcessing = normalizeTotal(timingsRaw.loadEventEnd - timingsRaw.domLoading);

            timings = {
                pageLoad,
                networkConnection,
                sendingRequest,
                receivingResponse,
                browserProcessing
            };
        }

        return timings;
    }
};
