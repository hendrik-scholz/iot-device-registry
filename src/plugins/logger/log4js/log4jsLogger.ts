import { configure, getLogger, Logger } from "log4js";

import { LogService } from "../logService";

export class Log4JsLogService implements LogService {
  private readonly logger: Logger;

  constructor() {
    configure({
      appenders: {
        console: {
          type: "console",
        },
        file: {
          filename: "app.log",
          type: "file",
        },
      },
      categories: {
        default: {
          appenders: ["console", "file"],
          level: "info",
        },
      },
    });

    this.logger = getLogger("iot-device-registry");
    this.logger.level = "info";
  }

  trace(message: String): void {
    this.logger.trace(message);
  }
  debug(message: String): void {
    this.logger.debug(message);
  }
  info(message: String): void {
    this.logger.info(message);
  }
  warn(message: String): void {
    this.logger.warn(message);
  }
  error(message: String): void {
    this.logger.error(message);
  }
  fatal(message: String): void {
    this.logger.fatal(message);
  }
}
