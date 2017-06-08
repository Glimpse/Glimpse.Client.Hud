const timingProxy = require('../proxy/timing');

module.exports = {
    render: function() {
        const timings = timingProxy.getTimings();

        return `
            <div class="glimpse-section glimpse-section--first glimpse-timing">
                <div class="glimpse-section-summary">
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
                <div class="glimpse-section-detail">
                    test<br />
                    test<br />
                    test<br />
                    test<br />
                    test<br />
                    test
                </div>
            </div>
        `;
    }
};
