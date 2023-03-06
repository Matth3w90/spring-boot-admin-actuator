# Spring-Boot-Admin-Actuator

![screenshot](https://www.matteovelletrani.it/img/readme/sba.png)

A package that provides a set of APIs used by spring-boot-admin to view the state of the microservice.

> **_IMPORTANT:_**
>This package does not directly register with eureka, so please refer to the [eureka-js-client](https///www.npmjs.com/package/eureka-js-client) package to register.

Table of Contents
=================

<!-- toc -->

- [Spring-Boot-Admin-Actuator](#spring-boot-admin-actuator)
- [Latest release news](#latest-release)
- [Endpoints](#endpoints)
- [Installation](#installation)
- [Usage](#usage)
- [Configuring](#configuring)
- [Mappings API configuration JSON](#mapping-json)
- Endpoints Examples
    - [info](#info)
    - [logfile](#logfile)
    - [health](#health)
    - [actuator](#actuator)
    - [configprops](#configprops)
	- [environment](#environment)
	- [mappings](#mappings)
	- [metrics](#metrics)
- [Creator](#creator)


<!-- tocstop -->

## Latest release

Starting with version 1.2.0, configuration keys returned by /env and /configprops will be hidden if the name contains "password" or "apikey"

<!-- tocstop -->

## Endpoints

API | Description
--- | ---
`info` | Displays application information.
`health` | Shows application health information.
`logfile` | Shows application log's.
`actuator` | Shows middleware api.
`configprops` | Shows application configuration.

Starting with version 1.1.0 the library will enable three more tabs on the SBA: mappings, metrics and env.

API | Description
--- | ---
`mappings` | Shows user defined application api.
`metrics` | Shows some application metrics.
`env` | Shows environment configuration.

## Installation

```bash
$ npm install --save spring-boot-admin-actuator
```

## Usage

To use this library you must pass as parameter an object that has inside the configurations that you want to show in tab "Configuration Properties" of the SBA and especially the mandatory properties for the correct functioning of the other APIs offered by the library, such as /actuator and /logfile


## Mandatory Properties:


Property | Description
--- | ---
`configurationObject.logFileAddr` | valued with phisical path of log to be sended to SBA
`configurationObject.ipAddr` | valued with ip of the service
`configurationObject.port` | valued with the port of the service

### Example Initialization:

```js

const sbaActuator = require('spring-boot-admin-actuator');
const app = express();
const mappingsDocument = require('./path/to/mappings.json')

const options = {
    config: configurationObject,
    mappings: mappingDocument, // NOT MANDATORY activate the mappings tab
	metricsIsActive: true, // NOT MANDATORY activate the metrics tab
    environmentIsActive: true // NOT MANDATORY activate the environment tab
};

app.use(sbaActuator(options));
```

Where the property mappings is not mandatory but if valued with mappings.json (of which you can find an example later) will enable the tab mappings on the SBA.

## mapping-json

```json
{
	"contexts": {
		"your-application-name": {
			"mappings": {
				"dispatcherServlets": {
					"api": [
						{
							"handler": "package.file.Method(parameter...)",
							"predicate": "{GET [/api/example/{path-variable}]}",
							"details": {
								"handlerMethod": {
									"className": "package.filename",
									"name": "name of the method",
									"descriptor": "description of method"
								},
								"requestMappingConditions": {
									"consumes": [],
									"headers": [],
									"methods": [
										"GET"
									],
									"params": [],
									"patterns": [
										"/api/example/{path-variable}"
									],
									"produces": [
										{
											"mediaType": "application/json",
											"negated": false
										}
									]
								}
							}
						},
                        {
                        "handler": "package.file.Method(parameter...)",
                        "predicate": "{POST [/api/example]}",
                        "details": {
                            "handlerMethod": {
                                "className": "package.filename",
                                "name": "name of the method",
                                "descriptor": "description of method"
                            },
                            "requestMappingConditions": {
                                "consumes": [{
                                    "mediaType": "application/json",
                                    "negated": false
                                }],
                                "headers": [],
                                "methods": ["POST"],
                                "params": [],
                                "patterns": ["/api/example"],
                                "produces": [{
                                    "mediaType": "application/json",
                                    "negated": false
                                }]
                            }
                        }
                    }
					]
				}
			}
		}
	}
}
```

## Endpoints Examples
### info
```json
{
    "build": {
        "name": "app",
        "version": "1.0.0",
        "node-version": ">12.6.0"
    },
}
```

> **_IMPORTANT:_** To get this information the middleware have some sort of logic:
>1. When the express app is executed with ```node app.js``` or ```npm start``` the module will look for a file named package.json where the node command was launched.

### health
```json
{
  "status": "UP"
}
```

### actuator
```json
{
            "_links": {
                "self": {
                    "href": "http://host:port/actuator",
                    "templated": false
                },
                "configprops": {
                    "href": "http:/host:port/actuator/configprops",
                    "templated": true
                },
                "logfile": {
                    "href": "http://host:port/actuator/logfile",
                    "templated": true
                },
                "health": {
                    "href": "http://host:port/actuator/health",
                    "templated": true
                },
                "info": {
                    "href": "http://host:port/actuator/info",
                    "templated": true
                }
            }
        }
```
> **_IMPORTANT:_**
>1. This endpoint needs the correct properties inside the configurationObject to replace placeholder hosts and ports (ipAddr and port).


### configprops
```json
{
	"contexts": {
		"application": {
			"configEureka": {
				"prefix": "configEureka",
				"properties": {
					"eurekaHost": ["http://localhost:8761/eureka/apps/"],
					"ipAddr": "127.0.0.1",
					"maxRetries": 10,
					"requestRetryDelay": 2000
				}
			},
			"logFileAddr": {
				"prefix": "logFileAddr",
				"properties": {
					"value": "C:\\Users\\user\\.pm2\\logs\\app-out.log"
				}
			},
			"ipAddr": {
				"prefix": "ipAddr",
				"properties": {
					"value": "127.0.0.1"
				}
			},
			"port": {
				"prefix": "port",
				"properties": {
					"value": 3000
				}
			}
		}
	}
}
```

> **_IMPORTANT:_**
>1. The data structure "contexts": { "application": {}} are added automatically by the SBA, the other (from "configEureka") in the example are exactly the configurationObject passed as parameter.

### logfile
```plain/text

	return log
	
```

> **_IMPORTANT:_**
>1. For this endpoint the middleware needs in the configurationObject the property logFileAddr to be valued with path of the log.

### mappings

![screenshot](https://www.matteovelletrani.it/img/readme/mappings.png)

> **_IMPORTANT:_**
>1. for this endpoint the library needs to add the mapping property as well as the configurationObject (which is mandatory).

### metrics

Starting with version 1.1 with the support of the metrics (if enabled) the library adds the display of the process life time directly on the SBA.

![screenshot](https://www.matteovelletrani.it/img/readme/uptime.png)

In combination with reading environment variables (if enabled) the process PID will also be shown.

The idea is to add more metrics later with new releases.



## Creator

[You can find me here](https://www.matteovelletrani.it/)
