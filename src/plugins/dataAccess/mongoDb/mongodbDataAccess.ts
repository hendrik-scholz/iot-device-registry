import mongoose from "mongoose";

import { Device } from "../../../types/device";
import { DeviceModel } from "./deviceSchema";
import { Geofence } from "../../../types/geofence";
import { DataAccess } from "../dataAccess";

export class MongoDbDataAccess implements DataAccess {

  private readonly dateTimeFormat = "%Y-%m-%dT%H:%M:%S.%LZ";

  constructor(connectionString: string) {
    mongoose
      .connect(connectionString, { useNewUrlParser: true })
      .then(() => console.log("Connected."))
      .catch(() => {
        throw new Error("Error connecting.");
      });
  }

  getDeviceForUuid(uuid: string): Promise<Device> {
    const pipeline: any[] = [];
    pipeline.push({ $match: { uuid } });
    pipeline.push({
      $project: {
        _id: 0,
        authorization: "$authorization",
        "geoPosition.type": "$geoposition.type",
        "geoPosition.coordinates.longitude": {
          $arrayElemAt: ["$geoposition.coordinates", 0],
        },
        "geoPosition.coordinates.latitude": {
          $arrayElemAt: ["$geoposition.coordinates", 1],
        },
        identification: "$identification",
        timestamp: { $dateToString: { date: "$timestamp", format: this.dateTimeFormat } },
        uuid: "$uuid",
      },
    });
    pipeline.push({ $limit: 1 });

    return new Promise((resolve, reject) => {
      DeviceModel.aggregate(pipeline)
        .exec()
        .then((document: any) => resolve(document[0]))
        .catch((error: any) => reject(error));
    });
  }

  getDevices(): Promise<Device[]> {
    const pipeline: any[] = [];
    pipeline.push({ $match: {} });
    pipeline.push({
      $project: {
        _id: 0,
        authorization: "$authorization",
        "geoPosition.type": "$geoposition.type",
        "geoPosition.coordinates.longitude": {
          $arrayElemAt: ["$geoposition.coordinates", 0],
        },
        "geoPosition.coordinates.latitude": {
          $arrayElemAt: ["$geoposition.coordinates", 1],
        },
        identification: "$identification",
        timestamp: { $dateToString: { date: "$timestamp", format: this.dateTimeFormat } },
        uuid: "$uuid",
      },
    });

    return DeviceModel.aggregate(pipeline).exec();
  }

  // https://docs.mongodb.com/manual/reference/operator/aggregation/geoNear/
  getDevicesForGeofence(geofence: Geofence): Promise<Device[]> {
    const pipeline: any[] = [];
    pipeline.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [geofence.longitude, geofence.latitude],
        },
        distanceField: "dist.calculated",
        spherical: true,
        maxDistance: geofence.radiusInMeters,
      },
    });
    pipeline.push({
      $project: {
        _id: 0,
        authorization: "$authorization",
        "geoPosition.type": "$geoposition.type",
        "geoPosition.coordinates.longitude": {
          $arrayElemAt: ["$geoposition.coordinates", 0],
        },
        "geoPosition.coordinates.latitude": {
          $arrayElemAt: ["$geoposition.coordinates", 1],
        },
        identification: "$identification",
        timestamp: { $dateToString: { date: "$timestamp", format: this.dateTimeFormat } },
        uuid: "$uuid",
      },
    });

    return DeviceModel.aggregate(pipeline).exec();
  }

  saveDevice(device: Device): Promise<void> {
    const deviceModel = new DeviceModel({
      authorization: {
        name: device.authorization.name,
        role: device.authorization.role,
        owner: device.authorization.deedOwner,
      },
      geoposition: {
        type: device.geoPosition.type,
        coordinates: [
          device.geoPosition.coordinates.longitude,
          device.geoPosition.coordinates.latitude,
        ],
      },
      identification: {
        company: device.identification.company,
        device: device.identification.device,
        version: device.identification.version,
        schedule: device.identification.schedule,
      },
      timestamp: device.timestamp,
      uuid: device.uuid,
    });

    return new Promise((resolve, reject) => {
      deviceModel
        .save()
        .then(() => resolve())
        .catch((error: Error) => reject(error));
    });
  }
}
