const colors = {
    error: '#b03b00',
    informational: '#1ba1e2',
    other: '#b5b5b5',
    redirection: '#f8a800',
    success: '#78b24c'
};

export function statusIcon(statusCode) {
    let path;

    if (statusCode < 200 || statusCode >= 400) {
        var fill = statusCode < 200
            ? colors.informational
            : colors.error;
        path = `<path d="M1023,512c282.7,0,512,229.3,512,512s-229.3,512-512,512s-512-229.3-512-512S740.3,512,1023,512z" fill="${fill}"></path>`;
    } else if (statusCode < 300) {
        path = `<path d="M511,512H1535V1536H511V512Z" fill="${colors.success}"></path>`;
    } else if (statusCode < 400) {
        path = `<path d="M1024,512L512,1536h1024L1024,512z" fill="${colors.redirection}"></path>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" class="glimpse-status-icon">${path}</svg>`;
}

const icons = {
    client: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" class="glimpse-agent-type-icon">
            <path d="M1024,74l950,950l-950,950L74,1024L1024,74z M274,1024l750,750l750-750l-750-750L274,1024z" fill="#EE89A2">
            </path>
        </svg>
    `,
    server: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" class="glimpse-agent-type-icon">
            <path d="M1024,174c469.8,0,850,380.2,850,850s-380.2,850-850,850s-850-380.2-850-850S554.2,174,1024,174z M1024,1674c357.6,0,650-291.6,650-650c0-357.6-292.4-650-650-650s-650,292.4-650,650S665.6,1674,1024,1674z" fill="#86d7f4">
            </path>
        </svg>
    `,
    error: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" class="icon-error">
            <path d="M1024,0c565,0,1024,459,1024,1024S1589,2048,1024,2048,0,1589,0,1024,459,0,1024,0Zm113,1024,342-342L1366,569,1024,911,682,569,569,682l342,342L569,1366l113,113,342-342,342,342,113-113-342-342Z" />
        </svg>
    `,
    warn: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" class="icon-warn">
            <path d="M1984,1984H64L1024,64l960,1920Zm-896-384.00006H960.00006V1728H1088V1599.99994ZM1088,1472V832H960.00006v640Z" />
        </svg>
    `,
    info: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" class="icon-info">
            <path d="M1024,64c530,0,960,430,960,960s-430,960.00006-960,960.00006S64,1554,64,1024,494,64,1024,64Zm64,768H960.00006v640H1088V832Zm0-256H960.00006V704H1088V576Z" />
        </svg>
    `,
    expandArrow: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" class="icon icon-arrow">
            <path d="M1024,1639.39437 L1154.61733,1518.74783 L2048,689.177567 L1786.76534,409 L1024,1116.92504 C1024,1116.92504 356.140625,497.736328 261.234664,409 C229.199219,443.951172 0,689.177567 0,689.177567 L893.382668,1518.74783 L1024,1639.39437 Z"></path>
        </svg>
    `,
    lockIcon: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" class="icon icon-lock">
            <path d="M1792,896V2048H256V896H512V522C512,234,733,0,1024,0s512,234,512,522V896ZM640,896h768V522c0-216-164-394-384-394S640,306,640,522V896Zm1024,128H384v896.00006H1664V1024Z" />
        </svg>
    `
};

export default icons;
