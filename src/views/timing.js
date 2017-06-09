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
            <div class="glimpse-hud-popup-section">
                <div class="glimpse-hud-field">
                    <div class="glimpse-hud-field-label">Load time</div>
                    <div class="glimpse-hud-field-value">${timings.pageLoad}</div>
                </div>
                <div class="glimpse-hud-field">
                    <div class="glimpse-hud-field-label">Network connection</div>
                    <div class="glimpse-hud-field-value">${timings.networkConnection}</div>
                </div>
                <div class="glimpse-hud-field">
                    <div class="glimpse-hud-field-label">Sending request</div>
                    <div class="glimpse-hud-field-value">${timings.sendingRequest}</div>
                </div>
                <div class="glimpse-hud-field">
                    <div class="glimpse-hud-field-label">Receiving response</div>
                    <div class="glimpse-hud-field-value">${timings.receivingResponse}</div>
                </div>
                <div class="glimpse-hud-field">
                    <div class="glimpse-hud-field-label">Browser processing</div>
                    <div class="glimpse-hud-field-value">${timings.browserProcessing}</div>
                </div>
            </div>
        `;
    }
};
