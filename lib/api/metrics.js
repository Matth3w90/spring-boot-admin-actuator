'use strict'

const { MetricsType } = require('../utils/sba-utils');

class Metrics {
    constructor() {

    }

    route(req, res) {
        res.status(200);
        res.set('Content-Type', 'application/vnd.spring-boot.actuator.v2+json');
        res.set('Cache-Control', 'no-cache');

        switch (req.params.metric) {
            case MetricsType.PROCESS_UPTIME:
                res.json({ "name": MetricsType.PROCESS_UPTIME, "description": "The uptime of the Process", "baseUnit": "seconds", "measurements": [{ "statistic": "VALUE", "value": process.uptime() }], "availableTags": [] });
                break;
            default:
                res.json({ "names": Object.values(MetricsType) });
                break;
        }
    }
}
module.exports = Metrics