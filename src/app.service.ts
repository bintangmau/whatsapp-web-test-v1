import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, RemoteAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { MongoStore } from 'wwebjs-mongo';
import * as mongoose from 'mongoose'

let whatsappClient = new Client({
  puppeteer: {
    args: ['--no-sandbox']
  }
});

@Injectable()
export class AppService implements OnModuleInit {

  onModuleInit() {
    mongoose.connect("mongodb://localhost:27017").then(() => {
      const store = new MongoStore({ mongoose: mongoose });
      whatsappClient = new Client({
        authStrategy: new RemoteAuth({
          store: store,
          backupSyncIntervalMs: 300000
        })
      });
      whatsappClient.on('qr', (qr) => {
        qrcode.generate(qr, {small: true});
      });
      whatsappClient.on('ready', () => {
        console.log('Client is ready!');
      });

      whatsappClient.on('message', message => {
        console.log(`${message.from}: ${message.body}`);
      });

      whatsappClient.initialize();
    });
  }

  async sendMessage(
    phone: string,
    message: string
  ) {
    whatsappClient.sendMessage(
      // `6282123130131@c.us`,
      `${phone}@c.us`,
      message
    );
  }

}
