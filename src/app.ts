import { DataAccess } from "./plugins/dataAccess/dataAccess";
import { DeviceService } from "./services/deviceService";
import { Log4JsLogService } from "./plugins/logger/log4js/log4jsLogger";
import { LogService } from "./plugins/logger/logService";
import { MongoDbDataAccess } from "./plugins/dataAccess/mongoDb/mongodbDataAccess";
import { HttpApi } from "./api/http";
import { Mqtt } from "./api/mqtt";
import { EventEmitter } from "events";
import { RegistrationService } from "./services/registrationService";

const eventEmitter = new EventEmitter();

const dataAccess: DataAccess = new MongoDbDataAccess(
  "mongodb://127.0.0.1:27017/test"
);
const logService: LogService = new Log4JsLogService();
const deviceService = new DeviceService(dataAccess, logService);

new HttpApi(deviceService, logService);
new Mqtt(eventEmitter, logService);
new RegistrationService(eventEmitter, deviceService);
