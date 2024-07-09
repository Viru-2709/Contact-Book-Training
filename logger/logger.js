require('dotenv').config();
const { format: dateFormat } = require('date-fns');
const { formatDate } = require('../library/general');
const fs = require('fs');
const path = require('path');
const logDriver = process.env.LOG_DRIVER;
const logLevel = process.env.LOG_LEVEL;
const logFolder = 'log';

if (!fs.existsSync(logFolder)) {
    try {
        fs.mkdirSync(logFolder);
    } catch (err) {
        console.error('Error creating log folder:', err);
    };
};

function logRequest(level, ...logMessages) {
    const formattedTime = formatDate(new Date());

    const logEntry = `[${formattedTime}] [${level}] ${logMessages.join('')}`;

    if (logDriver === 'file') {
        writeToLogFile(logEntry);
    } else {
        writeToConsole(logEntry);
    };
};

function logAccessRequest(reqUrl, incomingTime, responseTime, statusCode) {
    const formattedTime = formatDate(new Date());
    const timeDiff = responseTime - incomingTime;
    const logEntry = `[${formattedTime}] URL: ${reqUrl} | Incoming Time: ${incomingTime} | Response Time: ${responseTime} | Time Difference: ${timeDiff}ms | Status Code:${statusCode}`;
    const currentDate = dateFormat(new Date(), 'yyyy-MM-dd');
    const fileName = path.join(logFolder, `${currentDate}.access.log`);

    fs.appendFile(fileName, logEntry + '\n', (err) => {
        if (err) {
            console.error('Error writing to access log file:', err);
        }
    });
};

function writeToConsole(logEntry) {
    console.log(logEntry);
};

function writeToLogFile(logEntry) {
    const currentDate = dateFormat(new Date(), 'yyyy-MM-dd');
    const fileName = path.join(logFolder, `${currentDate}.log.log`);

    fs.appendFile(fileName, logEntry + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
};

function error(...logMessages) {
    if (logLevel >= 1) logRequest('error', ...logMessages);
};

function debug(...logMessages) {
    if (logLevel >= 2) logRequest('debug', ...logMessages);
};

function info(...logMessages) {
    if (logLevel >= 3) logRequest('info', ...logMessages);
};

function silly(...logMessages) {
    if (logLevel >= 4) logRequest('silly', ...logMessages);
};

module.exports = { error, debug, info, silly, logRequest, logAccessRequest };