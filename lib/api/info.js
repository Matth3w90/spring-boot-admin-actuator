'use strict'

const fs = require('fs');

var buildOptions;

class Info {
    constructor(options) {
        buildOptions = options
    }

    route(req, res) {
        const build = getBuildInfo(buildOptions);

        res.status(200).json({
            build: build
        })
    }
}

module.exports = Info


function getBuildInfo(options) {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    var build
    if (packageJson != undefined) {
        build = Object.assign({
            name: packageJson.name,
            description: packageJson.description,
            version: packageJson.version,
            "node-version": packageJson.engines.node
        }, options === Object(options) ? options : {})
    }
    return build
}