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
            "value": hideData(configuration[field])
          }
        }
      } else {
        props[field] = {
          "prefix": field,
          "properties": hideData(configuration[field])
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

// this function hide password or apikey from response of configprops
function hideData(objField){
  for(const property in objField){
    if(property.toLowerCase().includes("password") || property.toLowerCase().includes("apikey") 
        || property.toLowerCase().includes("key") || property.toLowerCase().includes("secret") 
          || property.toLowerCase().includes("credential")){
      objField[property] = "***************"
    }
  }
  return objField;
}