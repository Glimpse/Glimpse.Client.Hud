const timingProxy = require('../proxy/timing');

module.exports = {
    render: function() {
        const timings = timingProxy.getTimings();

        return `
            <div class="glimpse-section glimpse-timing">
                <div class="glimpse-section-summary">
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">
                            Page load time
                        </div>
                        <div class="glimpse-hud-field-value glimpse-time-ms">
                            ${timings.pageLoad}
                        </div>
                    </div>
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
                    <div class="glimpse-hud-field-value glimpse-time-ms">${timings.pageLoad}</div>
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">Network connection</div>
                        <div class="glimpse-hud-field-value glimpse-time-ms">${timings.networkConnection}</div>
                    </div>
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">Sending request</div>
                        <div class="glimpse-hud-field-value glimpse-time-ms">${timings.sendingRequest}</div>
                    </div>
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">Receiving response</div>
                        <div class="glimpse-hud-field-value glimpse-time-ms">${timings.receivingResponse}</div>
                    </div>
                    <div class="glimpse-hud-field">
                        <div class="glimpse-hud-field-label">Browser processing</div>
                        <div class="glimpse-hud-field-value glimpse-time-ms">${timings.browserProcessing}</div>
                    </div>
                </div>
            </div>
        `;
    }
};
