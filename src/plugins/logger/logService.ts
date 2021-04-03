export interface LogService {
  trace(message: String): void;

  debug(message: String): void;

  info(message: String): void;

  warn(message: String): void;

  error(message: String): void;

  fatal(message: String): void;
}
