import { Device } from "../../types/device";
import { Geofence } from "../../types/geofence";

export interface DataAccess {
  getDeviceForUuid(uuid: string): Promise<Device>;

  getDevices(): Promise<Device[]>;

  getDevicesForGeofence(geofence: Geofence): Promise<Device[]>;

  saveDevice(device: Device): Promise<void>;
}
