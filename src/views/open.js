const util = require('../lib/util');

const icon = `
    <svg class="glimpse-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
        <path class="glimpse-arrow-path" d="M1022,2H2046V1026H1918V221L91,2047,1,1957,1827,130H1022V2Z"/>
    </svg>
`;

module.exports = {
    arrowIcon: icon,
    render: function() {
        const url = util.resolveClientUrl(util.currentRequestId(), true);

        return `
            <a target="_glimpse" href="${url}" class="glimpse-link">
                ${icon}
                <span>Open in Glimpse</span>
            </a>
        `;
    }
};
