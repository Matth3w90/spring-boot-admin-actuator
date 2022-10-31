'use strict'

var json;

class Mappings {
    constructor(mappingJson) {
        json = mappingJson
    }

    route(req, res) {
        res.status(200);
        res.set('Content-Type', 'application/vnd.spring-boot.actuator.v2+json');
        res.set('Cache-Control', 'no-cache');
        res.send(json);
    }
}
module.exports = Mappings