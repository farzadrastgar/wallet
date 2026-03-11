"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const dateformat_1 = __importDefault(require("dateformat"));
// Define log levels and their corresponding colors
const logLevels = {
    info: chalk_1.default.blue,
    success: chalk_1.default.green,
    warn: chalk_1.default.yellow,
    error: chalk_1.default.red,
};
// Custom logger class with timestamp
class Logger {
    static info(message) {
        const logFunction = logLevels.info; // Default to white for unknown levels
        console.log(logFunction(`${(0, dateformat_1.default)(new Date(), "yyyy-mm-dd'T'HH:MM:sso")} [INFO]: ${message}`));
    }
    static success(message) {
        const logFunction = logLevels.success; // Default to white for unknown levels
        console.log(logFunction(`${(0, dateformat_1.default)(new Date(), "yyyy-mm-dd'T'HH:MM:sso")} [INFO]: ${message}`));
    }
    static warn(message) {
        const logFunction = logLevels.warn; // Default to white for unknown levels
        console.log(logFunction(`${(0, dateformat_1.default)(new Date(), "yyyy-mm-dd'T'HH:MM:sso")} [INFO]: ${message}`));
    }
    static error(message) {
        const logFunction = logLevels.error; // Default to white for unknown levels
        console.log(logFunction(`${(0, dateformat_1.default)(new Date(), "yyyy-mm-dd'T'HH:MM:sso")} [INFO]: ${message}`));
    }
}
exports.default = Logger;
