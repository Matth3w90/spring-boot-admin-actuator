'use strict'

var keylist, configuration;

class Configprops {
  constructor(keys, config) {
    keylist = keys,
      configuration = config
  }

  route(req, res) {

    var props = {};
    keylist.forEach(function (field) {

      if (typeof configuration[field] === "string" || typeof configuration[field] === "number") {
        props[field] = {
          "prefix": field,
          "properties": {
            "value": configuration[field]
          }
        }
      } else {
        props[field] = {
          "prefix": field,
          "properties": configuration[field]
        }
      }
    });

    res.status(200);
    res.json(
      props
    );
  }
}
module.exports = Configprops
















/*

 res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', "no-cache")
          res.json({
            "eureka": {
              "prefix": "configuration",
              "properties": config.configEureka,
            },
            "redis": {
              "prefix": "configuration",
              "properties": config.configRedis,
            },
            "message": {
              "prefix": "configuration",
              "properties": messages,
            },
            "logging":{
              "prefix": "configuration",
              "properties": {
                "address": config.logFileAddr
              }
            }
          })

*/