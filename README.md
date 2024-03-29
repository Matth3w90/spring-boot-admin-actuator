
# Spring-Boot-Admin-Actuator

![screenshot](https://www.matteovelletrani.it/img/readme/sba.png)

<br>

Description
=================

A package that provides a set of APIs used by spring-boot-admin to view the state of the microservice.

To read the latest version of the readme refer to this [link](#readme)

This library adds the endpoints invoked by the spring-boot-admin and must be used in conjunction with a library that takes care of the registration on a server-eureka.

**Then please refer to this eureka-js-package (https//www.npmjs.com/package/eureka-js-client) for registration, it is the one used for creating and testing this library.**

<br>

Table of Contents
=================

<!-- toc -->

- [Spring-Boot-Admin-Actuator](#spring-boot-admin-actuator)
- [Latest release news](#latest-release)
- [Endpoints](#endpoints)
- [Installation](#installation)
- [Usage](#usage)
- [Mappings API configuration JSON](#mapping-json)
- **Endpoints Examples**
    - [info](#info)
    - [logfile](#logfile)
	- [loggers](#loggers)
	   - [1.4.0](#140)
	   - [1.3.0](#130)
    - [health](#health)
    - [actuator](#actuator)
    - [configprops](#configprops)
	- [environment](#environment)
	- [mappings](#mappings)
	- [metrics](#metrics)
- Latest version of [readme](#readme)
- [Creator](#creator)

<br>

<!-- tocstop -->

## Latest release

Version 1.4.0 introduces the following new features:

Added support to configure log level at file level.
The library contains a logger.js file under the utils folder that you can use to integrate the new functionality introduced.
This has a custom logger class that integrates perfectly with the new version of the API loggers.

If you have already implemented the new API distributed with version 1.3.0 of this library version 1.4.0 continues to work without problems.

The "WARN" log level has also been added in the managed levels contained in the LoggerLevels object.

<br>
<!-- tocstop -->

## Endpoints



API | Description
--- | ---
`info` | Displays application information.
`health` | Shows application health information.
`logfile` | Shows application log's.
`actuator` | Shows middleware api.
`configprops` | Shows application configuration.

<br>

**Starting with version 1.1.0 the library will enable three more tabs on the SBA: mappings, metrics and env.**

API | Description
--- | ---
`mappings` | Shows user defined application api.
`metrics` | Shows some application metrics.
`env` | Shows environment configuration.

<br>


**Starting with version 1.3.0 the library will enable one more tab on SBA: loggers.**

API | Description
--- | ---
`logger` | Allows you to change the log level at runtime.

<br>


## Installation

```bash
$ npm install --save spring-boot-admin-actuator
```
<br>

## Usage

To use this library you must pass as parameter an object that has inside the configurations that you want to show in tab "Configuration Properties" of the SBA and especially the mandatory properties for the correct functioning of the other APIs offered by the library, such as /actuator and /logfile


## Mandatory Properties:
<br>


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
const {LoggerLevels} =  require('./utils/log-utils');

//Creation of the global variable containing the configurated log level
global.loggerLevel  =  LoggerLevels.INFO;

const options = {
    config: configurationObject,
    mappings: mappingDocument, // NOT MANDATORY activate the mappings tab
	metricsIsActive: true, // NOT MANDATORY activate the metrics tab
    environmentIsActive: true // NOT MANDATORY activate the environment tab
	loggersIsActive: true // NOT MANDATORY enable tab loggers, to be used in combination with the global loggerLevel variable
};

app.use(sbaActuator(options));
```
<br>

Where the property mappings is not mandatory but if valued with mappings.json (of which you can find an example later) will enable the tab mappings on the SBA.

Starting from version 1.4.0 the API loggers can be initialized in 2 ways:

1 - as described in the above example by passing "loggersIsActive = true" and initializing the global "loggerLevel" variable.

2 - by passing "loggersIsActive = true" and with "loggerMap" map defined in global variables

<br>


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
<br>


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

> **_IMPORTANT:_** To get this information the package have some sort of logic:
>When the express app is executed with ```node app.js``` or ```npm start``` the module will look for a file named package.json where the node command was launched.

<br>


### health
```json
{
  "status": "UP"
}
```
<br>

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
>This endpoint needs the correct properties inside the configurationObject to replace placeholder hosts and ports (ipAddr and port).

<br>

### configprops

<br>

The configuration keys shown in this tab are automatically hidden if the name contains the words "password", "apikey", "key", "secret" and "credential"

<br>

```json
{
	"contexts": {
		"application": {
			"eureka": {
				"prefix": "eureka",
				"properties": {
					"host": ["http://localhost:8761/eureka/apps/"],
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
>The data structure "contexts": { "application": {}} are added automatically by the SBA, the other (from "eureka") in the example are exactly the configurationObject passed as parameter.

<br>

### environment



<br>

The configuration keys shown in this tab are automatically hidden if the name contains the words "password", "apikey", "key", "secret" and "credential"

<br>

![screenshot](https://www.matteovelletrani.it/img/readme/env.png)

<br>

```json

{
	"activeProfiles": [
		"development"
	],
	"propertySources": [
		{
			"name": "systemProperties",
			"properties": {
				"ALLUSERSPROFILE": {
					"value": "C:\\ProgramData"
				}
			},
			"automation": {
				"value": "true"
			},
			"autorestart": {
				"value": "true"
			}
		}
	]
}
```

<br>

### logfile

![screenshot](https://www.matteovelletrani.it/img/readme/logfile.png)

> **_IMPORTANT:_**
>1. For this endpoint the library needs in the configurationObject the property logFileAddr to be valued with path of the log.
>2. Since version 1.3.0 a small fix has been introduced, if the log is empty to prevent the loading spinner from remaining on the SBA, the text "EMPTY LOG" is sent.

<br>

### mappings

![screenshot](https://www.matteovelletrani.it/img/readme/mappings.png)

> **_IMPORTANT:_**
>for this endpoint the library needs to add the mapping property as well as the configurationObject (which is mandatory).

<br>

### metrics

Starting with version 1.1 with the support of the metrics (if enabled) the library adds the display of the process life time directly on the SBA.

![screenshot](https://www.matteovelletrani.it/img/readme/uptime.png)

In combination with reading environment variables (if enabled) the process PID will also be shown.


<br>

### loggers

To use Loggers API at least one of global variable 'loggerLevel' (for 1.3.0 compatibility) or 'loggerMap' must be defined (since version 1.4.0)

<br>

#### 1.4.0

<br>

![screenshot](https://www.matteovelletrani.it/img/readme/loggersv2.png)

<br>


Since version 1.4.0 the library is distributed with the logger.js file that you can copy and use in your software, you can find it under utils/logger.js

This class integrates perfectly with the innovations introduced in the new version of the API loggers.

The WARN level has also been added to those managed.

#### logger.js

```js

const LEVELS = require('spring-boot-admin-actuator/lib/utils/logger-level').LoggerLevels;
const {performance} = require('perf_hooks');

const configuredLogLevel = "INFO" // THIS IS AN EXAMPLE, GET THIS DATA FROM YOUR CONFIGURATION

const startLevel = LEVELS[configuredLogLevel].name;

class Logger {
  constructor(classe) {
    this.classe = classe ? classe : undefined;

    if(typeof this.classe === 'undefined') {throw new Error("Required class parameter is missing")}

    this.debug = this.debug.bind(this);
    this.info = this.info.bind(this);
    this.warn = this.warn.bind(this);
    this.error = this.error.bind(this);
    this.writeToConsole = this.writeToConsole.bind(this);

    this.getClass = this.getClasse.bind(this);

    this.setLoggerMap(this.classe);

    this.getEffectiveLevel = this.getEffectiveLevel.bind(this);
  }

  static getStartTime(){
    return performance.now();
  }

  /**
   * 
   * @param {*} level: level of the log
   * @param {*} method: the method that generated the log 
   * @param {*} message: the message of the log
   * @param {*} start: a timestamp, if present adds to the messagge the execution time in milliseconds.
   * 
   * @returns 2023-10-21T10:51:39.946Z | INFO | message.controller.js | read | END | 45.89750003814697 ms. |
   */
  writeToConsole(level, method, message, start) {
    if (LEVELS[global.loggerMap[this.classe].effectiveLevel].order <= LEVELS[level].order) {
        const end = start != undefined ?  performance.now() - start : undefined
        const dateTime = new Date().toISOString();
        const formattedMessage = dateTime + " | " + level + " | " + this.classe + " | " + method + " | " + message + " | " + (end != undefined ? (end + " ms. |") : "");
        console[level.toLowerCase()](formattedMessage);
    }
  }

  debug(method, message, start) {
    this.writeToConsole('DEBUG', method, message, start);
  }

  info(method, message, start) {
    this.writeToConsole('INFO', method, message, start);
  }

  warn(method, message, start) {
    this.writeToConsole('WARN', method, message, start);
  }

  error(method, message, start) {
    this.writeToConsole('ERROR', method, message, start);
  }

  getClasse(){
    return this.classe;
  }

  getEffectiveLevel(){
    return global.loggerMap[classe].effectiveLevel;
  }

  setLoggerMap(classe){
    if(typeof global.loggerMap === 'undefined'){
        global.loggerMap = {
            "ROOT": {
                "configuredLevel": startLevel,
                "effectiveLevel": startLevel
            }
        }
    }
    global.loggerMap[classe] = {
        "configuredLevel": startLevel,
        "effectiveLevel": startLevel
    }
  }
}

module.exports = Logger


```
Each time a logger is instantiated by calling the constructor method, it automatically adds the new logger to the global.loggerMap.

the logger class provided contains the log level control logic relative to the file level, it uses the updated LoggerLevels object present in the library.

Here is an example of using the logger class provided:

```js
const Logger = require('../../utils/logger');
const log = new Logger("message.controller.js");

log.debug(method, "message");
```

<br>

> **_IMPORTANT:_**
> To use this version of API your software must set the global loggerMap variable.

#### 1.3.0

![screenshot](https://www.matteovelletrani.it/img/readme/loggers.png)

With version 1.3.0 the library adds the loggers tab that allows you to change the log level at runtime

With 1.3.0 automatically the library allows you to manage only the root level of the log.

This API uses the global loggerLevel variable and should be used to allow/inhibit the methods you use to log.

Managed log levels are 4: OFF, DEBUG, INFO and ERROR.

An example of usage in combination with custom log methods:

```js
exports.debug = function(method, message, start) {
	if(!isDebugEnabled()){ return; }
	console.debug(new Date().toISOString()+" | DEBUG | "+ method +" | "+message+" | ");
};

exports.error = function(method, message, start) {
	if(!isEnabled()){ return; }
	console.error(new Date().toISOString()+" | ERROR | "+method+" | "+message+" | ");
};

function isDebugEnabled(){ return (global.loggerLevel != LoggerLevels.OFF) && (global.loggerLevel != LoggerLevels.INFO) && (global.loggerLevel != LoggerLevels.ERROR); }
function isEnabled(){ return (global.loggerLevel != LoggerLevels.OFF); }

const LoggerLevels = Object.freeze({"OFF":"OFF", "DEBUG":"DEBUG", "INFO":"INFO","ERROR":"ERROR"});

```
<br>

To use it with the most common log libraries (such as Winston or log4js) you just need to create wrapper methods that perform in them the control on the set log level and then call the methods of the library used.

<br>

> **_IMPORTANT:_**
> To use this API your software must set the global loggerLevel variable otherwise the package will throw an exception. 

<br>

### Readme

Latest readme version: [click here](https://github.com/Matth3w90/spring-boot-admin-actuator#spring-boot-admin-actuator)

<br>

### Creator

[You can find me here](https://www.matteovelletrani.it/)
