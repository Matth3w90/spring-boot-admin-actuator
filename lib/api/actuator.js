'use strict'

var ipAddress, serverPort;

class Actuator {

    constructor(ipAddr, port) {
        ipAddress = ipAddr,
        serverPort = port
    }

    route(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.json({
            "_links": {
                "self": {
                    "href": "http://"+ipAddress+":"+serverPort+"/actuator",
                    "templated": false
                },
                "configprops": {
                    "href": "http:/"+ipAddress+":"+serverPort+"/actuator/configprops",
                    "templated": true
                },
                "logfile": {
                    "href": "http://"+ipAddress+":"+serverPort+"/actuator/logfile",
                    "templated": true
                },
                "health": {
                    "href": "http://"+ipAddress+":"+serverPort+"/actuator/health",
                    "templated": true
                },
                "info": {
                    "href": "http://"+ipAddress+":"+serverPort+"/actuator/info",
                    "templated": true
                }
            }
        });
    }
}
module.exports = Actuator