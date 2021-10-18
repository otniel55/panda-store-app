import { Component, OnInit } from '@angular/core';

import { StorageService } from 'src/app/services/storage.service';
import { Order } from 'src/app/shared/models/order';
import { asyncForeach } from 'src/app/shared/utils/arr';
import { sleep } from 'src/app/shared/utils/sleep';

@Component({
  selector: 'app-received',
  templateUrl: './received.page.html',
  styleUrls: ['./received.page.scss'],
})
export class ReceivedPage implements OnInit {
  orders: Order[] = [];

  constructor(private storage: StorageService) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await sleep(200);
    const keys = await this.storage.keys();
    this.orders = [];

    await asyncForeach(async (key) => {
      const order = await this.storage.get(key);

      if (order.state === 'RB') {
        this.orders.push(order);
      }
    }, keys);
  }

  trackByFunc(index, item) {
    return item ? item.id : index;
  }

  async markLikeBilled(order) {
    order.state = 'FC';
    await this.storage.set(order.id, order);
    this.orders = this.orders.filter((item) => item.state === 'RB');
  }

  async markLikeDelivered(order) {
    order.state = 'ET';
    await this.storage.set(order.id, order);
    this.orders = this.orders.filter((item) => item.state === 'RB');
  }

  openWs(e, phone: string) {
    e.stopPropagation();
    e.preventDefault();
    window.open(`whatsapp://send?phone=58${phone}`);
  }
}
