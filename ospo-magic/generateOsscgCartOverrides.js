
const fs = require('fs');

const pkg = process.argv[2];

fs.readFile(pkg, 'utf8', (err, data) => {

    const components = [];
    const p = JSON.parse(data);
    const deps = p['dependencies'];
    for (d in deps) {
        if (deps.hasOwnProperty(d)) {
            components.push({
                component: {
                    "npmjs.org": {
                        name: d
                    }
                },
                "ms.transmitted": true,
                "ms.modified": false
            });
        }
    }
    const output = JSON.stringify({ components } , undefined, '  ');
    process.stdout.write(output);
});




