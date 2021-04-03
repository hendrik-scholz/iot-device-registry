import { LogService } from '../plugins/logger/logService';
import { DataAccess } from '../plugins/dataAccess/dataAccess';
import { Device } from '../types/device';
import { Geofence } from '../types/geofence';

export class DeviceService {
  private readonly dataAccess: DataAccess;

  private readonly logger: LogService;

  constructor(dataAccess: DataAccess, logger: LogService) {
    this.dataAccess = dataAccess;
    this.logger = logger;
  }

  getDeviceForUuid(uuid: string): Promise<Device> {
    this.logger.info('Getting device for UUID ...');
    return this.dataAccess.getDeviceForUuid(uuid);
  }

  getDevices(): Promise<Device[]> {
    this.logger.info('Getting devices ...');
    return this.dataAccess.getDevices();
  }

  getDevicesForGeofence(geofence: Geofence): Promise<Device[]> {
    this.logger.info('Getting devices for geofence ...');
    return this.dataAccess.getDevicesForGeofence(geofence);
  }

  saveDevice(device: Device): Promise<void> {
    this.logger.info('Saving device ...');
    return this.dataAccess.saveDevice(device);
  }
}
