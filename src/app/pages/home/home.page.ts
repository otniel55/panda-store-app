import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { asyncForeach } from 'src/app/shared/utils/arr';
import { sleep } from 'src/app/shared/utils/sleep';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  customers: any[] = [];
  receiveds: any[] = [];
  orders: any[] = [];

  constructor(private storage: StorageService) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.init();
  }

  async init() {
    await sleep(200);
    const keys = await this.storage.keys();
    this.customers = [];

    await asyncForeach(async (key) => {
      this.customers.push(await this.storage.get(key));
    }, keys);

    this.setLists();
  }

  trackByFunc(index, item) {
    return item ? item.id : index;
  }

  async delete(id: string) {
    await this.storage.delete(id);
    this.customers = this.customers.filter((item) => item.id !== id);
    this.setLists();
  }

  async deliver(order) {
    order.state = 'ET';
    await this.storage.set(order.id, order);
    this.customers = this.customers.filter((item) => item.id !== order.id);
    this.setLists();
  }

  setLists() {
    this.orders = this.customers.filter((item) => item.state === 'PD');
    this.receiveds = this.customers.filter((item) => item.state === 'RB');
  }

  openWs(e, phone: string) {
    e.stopPropagation();
    e.preventDefault();
    window.open(`whatsapp://send?phone=${phone}`);
  }
}
