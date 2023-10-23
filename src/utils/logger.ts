import chalk from "chalk";
import dateFormat from "dateformat";

// Define log levels and their corresponding colors
const logLevels = {
  info: chalk.blue,
  success: chalk.green,
  warn: chalk.yellow,
  error: chalk.red,
};

// Custom logger class with timestamp
class Logger {
  static info(message: any) {
    const logFunction = logLevels.info; // Default to white for unknown levels
    console.log(
      logFunction(
        `${dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM:sso")} [INFO]: ${message}`
      )
    );
  }

  static success(message: any) {
    const logFunction = logLevels.success; // Default to white for unknown levels
    console.log(
      logFunction(
        `${dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM:sso")} [INFO]: ${message}`
      )
    );
  }

  static warn(message: any) {
    const logFunction = logLevels.warn; // Default to white for unknown levels
    console.log(
      logFunction(
        `${dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM:sso")} [INFO]: ${message}`
      )
    );
  }

  static error(message: any) {
    const logFunction = logLevels.error; // Default to white for unknown levels
    console.log(
      logFunction(
        `${dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM:sso")} [INFO]: ${message}`
      )
    );
  }
}

export default Logger;
