
const fs = require('fs');

const pkg = process.argv[2];

fs.readFile(pkg, 'utf8', (err, data) => {

    const components = [];
    const p = JSON.parse(data);
    const deps = p['dependencies'];
    for (d in deps) {
        if (deps.hasOwnProperty(d)) {
            const x = {
                component: {
                    "npmjs.org": {
                        name: d
                    }
                },
                "ms.transmitted": true,
                "ms.modified": false
            };

            if (d === 'emojione') {
                x.license = 'MultipleLicenses';
            }
            else if (d === 'uri-templates') {
                x.license = 'PublicDomain';
            }
            components.push(x);
        }
    }
    const output = JSON.stringify({ components }, undefined, '  ');
    process.stdout.write(output);
});
