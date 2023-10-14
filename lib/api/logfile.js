'use strict'

const fs = require('fs');

var logAddress;

class Logfile {

    constructor(logFileAddr) {
        logAddress = logFileAddr
    }

    route(req, res) {
        var log = fs.readFileSync(logAddress);
        if(log.byteLength == 0){log = Buffer.from("EMPTY LOG", "utf-8");}
        let sba = getLogforSBA(req.headers.range, log.byteLength);
        res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Range', sba.begin + "/" + sba.end);
        res.setHeader('Cache-Control', "no-cache")
        res.status(sba.state);
        res.send(log.toString("utf8", sba.begin, sba.end));
    }
}
module.exports = Logfile

function getLogforSBA(range, logByteLenght) {
    var array = range != undefined ? range.split("-") : ["0", ""];
    var state;
    var end = array[1];
    if (end == "") { end = logByteLenght; }
    var begin = array[0].split("=")[1];
    begin = begin == "" ? 0 : begin;
    if (begin == end) { end = logByteLenght - 1; }

    if (begin == 0) { state = 200; }
    else { state = 206; }

    var sba = {};
    sba.begin = Number(begin);
    sba.end = Number(end);
    sba.state = state;

    return sba;
};
