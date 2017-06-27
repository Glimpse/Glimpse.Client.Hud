module.exports = {
    render: function() {
        return `
            <div class="glimpse-section glimpse-expand-button" id="js-glimpse-expand-button" title="expand">
            </div>
        `;
    },
    renderPopup: function() {
        return `
            <div class="glimpse-hud-popup-section glimpse-hud-popup-section--arrow" id="js-glimpse-collapse-button" title="collapse">
            </div>
        `;
    }
};
