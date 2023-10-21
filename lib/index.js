'use strict'

const Info = require('./api/info');
const Logfile = require('./api/logfile');
const Loggers = require('./api/loggers');
const Health = require('./api/health');
const Configprops = require('./api/configprops');
const Actuator = require('./api/actuator');

const Mappings = require('./api/mappings');
const Metrics = require('./api/metrics');
const EnvApi = require('./api/env');

const express = require('express')

const baseConfiguration = {
    basePath: '/actuator'
}

/**
 * 
 * @param {*} options basic configuration object that must contain some mandatory properties and others not that enable tabs on the sba* 
 * @returns adds the APIs invoked by the SBA to your express app
 */
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

    // Version 1.1 new API
    if (opts.mappings) { router.get(opts.basePath + '/mappings', new Mappings(opts.mappings).route); }
    if (opts.metricsIsActive) { router.get(opts.basePath + '/metrics', new Metrics().route); router.get(opts.basePath + '/metrics/:metric', new Metrics().route); }
    if (opts.environmentIsActive) { router.get(opts.basePath + '/env/:var', new EnvApi().route); router.get(opts.basePath + '/env', new EnvApi().route); }
    
    // API Loggers since 1.3.0
    if (opts.loggersIsActive) {

        // 1.3 backcompatibility mode
        if(global.loggerLevel && (typeof global.loggerMap === 'undefined')){
            Loggers.originalLevel = global.loggerLevel;
            const logger = new Loggers();
            router.get(opts.basePath + '/loggers', logger.route);
            router.post(opts.basePath + '/loggers/:class', logger.changeLevel);
        } else if(global.loggerMap){
            // 1.4.0
            const logger = new Loggers();
            router.get(opts.basePath + '/loggers', logger.routeV2);
            router.post(opts.basePath + '/loggers/:class', logger.changeLevelV2);
        } else {
            // no way to instantiate loggers
            throw new Error("To use Loggers API at least one of global variable 'loggerLevel' or 'loggerMap' must be defined, see documentation")
        }
    }

    return router;
}