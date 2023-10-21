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
   * @param {*} level level of the log
   * @param {*} method the method that generated the log 
   * @param {*} message the message of the log
   * @param {*} start a timestamp, if present adds to the messagge the execution time in milliseconds.
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