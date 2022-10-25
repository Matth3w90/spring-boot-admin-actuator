'use strict'

const Info = require('./api/info');
const Logfile = require('./api/logfile');
const Health = require('./api/health');
const Configprops = require('./api/configprops');
const Actuator = require('./api/actuator');
const express = require('express')

const baseConfiguration = {
    basePath: '/actuator'
}

module.exports = function sbaActuatorMiddleware(options) {

    const router = express.Router();
    const opts = Object.assign({}, baseConfiguration, options);

    const info = new Info(opts.config.infoBuildOptions);
    const logfile = new Logfile(opts.config.logFileAddr);

    router.get(opts.basePath + '/info', info.route);
    router.get(opts.basePath + '/health', new Health().route);
    router.get(opts.basePath + '/logfile', logfile.route);
    router.get(opts.basePath, new Actuator(opts.config.ipAddr, opts.config.port).route);

    const configprops = new Configprops(Object.keys(options.config), options.config);
    router.get(opts.basePath + '/configprops', configprops.route)

    return router;
}