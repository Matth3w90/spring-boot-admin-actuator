'use strict'

class Env {
    constructor() {
    }

    route(req, res) {
        var environment = {};
        Object.entries(process.env).forEach(entry => {
            var[key, value] = entry;
            if(key.toLowerCase().includes("password") || key.toLowerCase().includes("apikey") 
                    || key.toLowerCase().includes("key") || key.toLowerCase().includes("secret") 
                        || key.toLowerCase().includes("credential")){
                value = "***************"
            }
            environment[key] = {
                "value": value
            };
        });

        res.set('Content-Type', 'application/vnd.spring-boot.actuator.v2+json');
        res.set('Cache-Control', 'no-cache');

        if (req.params.var == "PID") {
            res.json({
                "property": {
                    "source": "systemProperties",
                    "value": process.pid
                },
                "activeProfiles": [process.env.NODE_ENV],
                "propertySources": []
            });
            return;
        }


        res.json(
            {
                "activeProfiles": [process.env.NODE_ENV],
                "propertySources": [{
                    "name": "systemProperties",
                    "properties": environment
                }
                ]
            }
        );
    }
}
module.exports = Env