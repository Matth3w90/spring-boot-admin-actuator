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
}

module.exports = Loggers;