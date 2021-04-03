import { Logger } from "../../../src/plugins/logger/logService";

export class TestLogger implements Logger {
  private readonly log: string[];

  constructor() {
    this.log = [];
  }

  trace(message: string): void {}

  debug(message: string): void {}

  info(message: string): void {
    this.log.push(message);
  }

  warn(message: string): void {}

  error(message: string): void {}

  fatal(message: string): void {}

  getLog(): string[] {
    return this.log;
  }
}
