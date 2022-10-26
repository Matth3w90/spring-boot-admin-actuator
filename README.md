# Spring-Boot-Admin-Actuator

A package that provides a set of APIs used by spring-boot-admin to view the state of the microservice by registering with eureka server.


Table of Contents
=================

<!-- toc -->

- [Spring-Boot-Admin-Actuator](#express-actuator)
- [Table of Contents](#table-of-contents)
  - [Endpoints](#endpoints)
  - [Installation](#installation)
      - [Nodejs](#nodejs)
  - [Usage](#usage)
  - [Configuring](#configuring)
  - [Endpoints Examples](#endpoints-examples)
    - [info](#info)
    - [logfile](#logfile)
    - [health](#health)
    - [actuator](#actuator)
    - [configprops](#configprops)
  - [Application Information](#application-information)
    - [Git Commit Information](#git-commit-information)

<!-- tocstop -->

## Endpoints

API | Description
--- | ---
`info` | Displays application information.
`health` | Shows application health information.
`logfile` | Shows application log's.
`actuator` | Shows middleware api.
`configprops` | Shows application configuration.

## Installation

```bash
$ npm install --save spring-boot-admin-actuator
```

## Usage


By passing a configuration object this will be used in all the sba endpoints.

## Mandatory Properties:


API | Description
--- | ---
`configurationObject.logFileAddr` | valued with phisical path of log to be sended to SBA
`configurationObject.ipAddr` | valued with ip of the service
`configurationObject.port` | valued with the port of the service

```js
const options = {
    config: configurationObject
};

app.use(sbaActuator(options));
```


> **_IMPORTANT:_** To get this information the middleware have some sort of logic:
>1. When the express app is executed with ```node app.js``` or ```npm start``` the module will look for a file named package.json where the node command was launched.
>2. All the other property (like ipAddress or server port in the example) are passed by configuration object.

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
>1. The data structure "contexts": { "application": {}} are added automatically by the SB

### logfile
```plain/text

	return log
	
```

> **_IMPORTANT:_**
>1. For this endpoint the middleware need in the configurationObject the property logFileAddr to be valued with path of the log.
