const timingProxy = require('../proxy/timing');

module.exports = {
    render: function() {
        const timings = timingProxy.getTimings();

        return `
            <div class="glimpse-section glimpse-timing">
                <div class="glimpse-section-summary">
                    <span class="glimpse-section-label">
                        Page load time
                    </span>
                    <span class="glimpse-section-duration glimpse-section-value">
                        ${timings.pageLoad}
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
    },
    renderPopup: function() {
        const timings = timingProxy.getTimings();

        return `
            <div>
                <div>
                    <div>Load time</div>
                    <div>${timings.pageLoad}</div>
                </div>
                <div>
                    <div>
                        <div>Network connection</div>
                        <div>${timings.networkConnection}</div>
                    </div>
                    <div>
                        <div>Sending request</div>
                        <div>${timings.sendingRequest}</div>
                    </div>
                    <div>
                        <div>Receiving response</div>
                        <div>${timings.receivingResponse}</div>
                    </div>
                    <div>
                        <div>Browser processing</div>
                        <div>${timings.browserProcessing}</div>
                    </div>
                </div>
            </div>
        `;
    }
};
