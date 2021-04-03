import { Device } from '../types/device';
import { EventEmitter } from 'events';
import { DeviceService } from './deviceService';

export class RegistrationService {
  private readonly eventName = 'registration';

  constructor(eventEmitter: EventEmitter, deviceService: DeviceService) {
    eventEmitter.on(this.eventName, (device: Device) => {
      deviceService.saveDevice(device);
    });
  }
}
