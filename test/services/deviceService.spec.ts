import chai from 'chai';
import chaiExclude from 'chai-exclude';

import { TestDataAccess } from '../plugins/dataAccess/testDataAccess';
import { DeviceService } from '../../src/services/deviceService';
import { Geofence } from "../../src/types/geofence";
import { TestLogger } from '../plugins/logger/testLogger';

chai.use(chaiExclude);

const expect = chai.expect;

const expectedDevice = {
    authorization: {
        name: "Mike Donovan",
        role: "Engineer",
        deedOwner: "U.S. Robots and Mechanical Men"
    },
    geoPosition: {
        type: "Point",
        coordinates: {
            longitude: -139.43114,
            latitude: 64.065085
        }
    },
    identification: {
        company: "U.S. Robots and Mechanical Men",
        device: "SPD-13",
        schedule: [
            {
                dateTime: "2015-07-07T08:00:00.00Z",
                description: "mining"
            }
        ],
        version: "13"
    },
    timestamp: "2015-01-01T00:00:00.00Z",
    uuid: "50b56281-1d81-4db1-b739-1ea234d16b1c"
};

describe('Services', () => {
    describe('Device Service', () => {
        it('should return a list of all devices', () => {
            const testDataAccess = new TestDataAccess();
            const testLogger = new TestLogger();
            const devices = new DeviceService(testDataAccess, testLogger);
            const expectedDevices = [expectedDevice];

            expect(devices.getDevices().length).to.equal(1);
            expect(devices.getDevices()).to.deep.equal(expectedDevices);
        });

        it('should return a device with a certain UUID', () => {
            const testStorage = new TestDataAccess();
            const testLogger = new TestLogger();
            const devices = new DeviceService(testStorage, testLogger);

            expect(devices.getDeviceForUuid("50b56281-1d81-4db1-b739-1ea234d16b1c")).to.deep.equal(expectedDevice);
        });

        it('should return a list of all devices within a certain geofence', () => {
            const testStorage = new TestDataAccess();
            const testLogger = new TestLogger();
            const devices = new DeviceService(testStorage, testLogger);
            const expectedDevices = [expectedDevice];

            const geoFence : Geofence = {
                longitude: 0,
                latitude: 0,
                radiusInMeters: 1000
            };

            expect(devices.getDevicesForGeofence(geoFence)).to.deep.equal(expectedDevices);
        });

        it('should save a device', () => {
            const deviceToSave = {
                authorization: {
                    name: "Gregory Powell",
                    role: "Engineer",
                    deedOwner: "U.S. Robots and Mechanical Men"
                },
                geoPosition: {
                    type: "Point",
                    coordinates: {
                        longitude: -139.436850,
                        latitude: 64.061319
                    }
                },
                identification: {
                    company: "U.S. Robots and Mechanical Men",
                    device: "QT-1",
                    schedule: [
                        {
                            dateTime: "2015-07-08T08:00:00.00Z",
                            description: "thinking"
                        }
                    ],
                    version: "1"
                },
                timestamp: "2015-01-01T01:00:00.00Z",
                uuid: "e846662d-4da0-431d-b9af-ca0cb833aa2b"
            };

            const testStorage = new TestDataAccess();
            const testLogger = new TestLogger();
            const devices = new DeviceService(testStorage, testLogger);
            const expectedDevices = [expectedDevice, deviceToSave];

            expect(devices.getDevices().length).to.equal(1);
            expect(devices.saveDevice(deviceToSave));
            expect(devices.getDevices().length).to.equal(2);
            expect(devices.getDevices()).to.deep.equal(expectedDevices);

            expect(testLogger.getLog().length).to.equal(1);
            expect(testLogger.getLog()).to.deep.equal(["Saving device."]);
        });
    });
});