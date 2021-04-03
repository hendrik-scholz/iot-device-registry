import { DataAccess } from "../../../src/plugins/dataAccess/dataAccess";
import { Device } from "../../../src/types/device";
import { Geofence } from "../../../src/types/geofence";

export class TestDataAccess implements DataAccess {
  private readonly device: Device = {
    authorization: {
      name: "Mike Donovan",
      role: "Engineer",
      deedOwner: "U.S. Robots and Mechanical Men",
    },
    geoPosition: {
      type: "Point",
      coordinates: {
        longitude: -139.43114,
        latitude: 64.065085,
      },
    },
    identification: {
      company: "U.S. Robots and Mechanical Men",
      device: "SPD-13",
      schedule: [
        {
          dateTime: "2015-07-07T08:00:00.00Z",
          description: "mining",
        },
      ],
      version: "13",
    },
    timestamp: "2015-01-01T00:00:00.00Z",
    uuid: "50b56281-1d81-4db1-b739-1ea234d16b1c",
  };

  private readonly devices: Map<string, Device>;

  constructor() {
    this.devices = new Map();
    this.devices.set(this.device.uuid, this.device);
  }

  getDeviceForUuid(uuid: string): Promise<Device> {
    let device = this.devices.get(uuid);
    return new Promise((resolve, reject) => {
      resolve(device != undefined ? device : this.device);
    }); // TODO: Device or undefined/null or Promise<Device>
  }

  getDevices(): Promise<Device[]> {
    return new Promise((resolve, reject) => {
      resolve(Array.from(this.devices).map((entry) => entry[1]));
    });
  }

  getDevicesForGeofence(geofence: Geofence): Promise<Device[]> {
    return new Promise((resolve, reject) => {
      resolve(Array.from(this.devices).map((entry) => entry[1]));
    });
  }

  saveDevice(device: Device): Promise<void> {
    this.devices.set(device.uuid, device);
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}
