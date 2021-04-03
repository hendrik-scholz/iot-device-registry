import { EventEmitter } from 'events';
import mqtt from 'mqtt';
import { LogService } from '../plugins/logger/logService';

export class Mqtt {
  private readonly eventName = 'registration';

  private readonly mqttHost = '127.0.0.1';

  private readonly mqttPort = 1883;

  private readonly mqttTopic = 'registration';

  constructor(eventEmitter: EventEmitter, logService: LogService) {
    if (this.mqttHost && this.mqttPort && this.mqttTopic) {
      logService.info('Connecting to MQTT broker.');
      const mqttClient = mqtt.connect(`mqtt:${this.mqttHost}:${this.mqttPort}`);

      mqttClient.on('connect', () => {
        logService.info('Successfully connected to MQTT broker.');
        logService.info(`Subscribing to topic '${this.mqttTopic}'.`);
        mqttClient.subscribe(this.mqttTopic, (error) => {
          if (error) {
            logService.error(error.message);
          } else {
            logService.info(
              `Successfully subscribed to topic '${this.mqttTopic}'.`
            );
          }
        });
      });

      mqttClient.on('message', (topic, messageAsBuffer) => {
        logService.info(`Received message: ${messageAsBuffer.toString()}.`);

        const message = JSON.parse(messageAsBuffer.toString());
        eventEmitter.emit(this.eventName, message);
      });

      mqttClient.on('error', (error) => {
        logService.error(JSON.stringify(error));
      });
    }
  }
}
