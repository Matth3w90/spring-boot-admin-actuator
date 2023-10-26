'use strict'
const LoggerLevels = require('../utils/logger-level').LoggerLevels;

class Loggers {

    static originalLevel;

    route(req, res) {
        res.status(200).json(
            {
                "levels": Object.keys(LoggerLevels),
                "loggers": {
                    "ROOT": {
                        "configuredLevel": Loggers.originalLevel,
                        "effectiveLevel": global.loggerLevel
                    }
                }
           }
        )
    }

    changeLevel(req, res) {
        if (req.params.class == "ROOT") {
            global.loggerLevel = req.body.configuredLevel;
            res.sendStatus(200);
        }
    }

    // Introduced methods with v1.4.0
    routeV2(req, res) {
        res.status(200).json(
            {
                "levels": Object.keys(LoggerLevels),
                "loggers": global.loggerMap
            }
        )
    }
    changeLevelV2(req, res) {
        if(req.params.class == "ROOT"){
            Object.keys(global.loggerMap).forEach(function(key) {
                global.loggerMap[key].effectiveLevel = req.body.configuredLevel;
            });
        } else {
            if(Object.keys(req.body).length == 0 || req.body.configuredLevel == null){
                global.loggerMap[req.params.class].effectiveLevel = global.loggerMap[req.params.class].configuredLevel
            } else {
                global.loggerMap[req.params.class].effectiveLevel = req.body.configuredLevel
            }
        }
        res.sendStatus(200);
    }
}

module.exports = Loggers;