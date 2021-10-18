/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private _storage: Storage | null = null;

  constructor() {
    this.init();
  }

  async init() {
    this._storage = await new Storage({
      name: '__pandastore',
      storeName: 'customers',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
    }).create();
  }

  async set(key: string, value: any) {
    await this._storage?.set(key, value);
  }

  async get(key: string) {
    return await this._storage?.get(key);
  }

  async keys() {
    return await this._storage?.keys();
  }

  async delete(key: string) {
    return await this._storage?.remove(key);
  }
}
