const timingProxy = require('../proxy/timing');

module.exports = {
    render: function() {
        const timings = timingProxy.getTimings();

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
