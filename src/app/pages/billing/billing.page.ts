import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ToastController } from '@ionic/angular';
import * as moment from 'moment';

import { sleep } from 'src/app/shared/utils/sleep';
import { arraySum, asyncForeach } from 'src/app/shared/utils/arr';
import { Order } from './../../shared/models/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.page.html',
  styleUrls: ['./billing.page.scss'],
})
export class BillingPage implements OnInit {
  orders: Order[] = [];
  billedOrders: Order[] = [];
  total = 0;

  constructor(
    private storage: OrderService,
    public toastController: ToastController,
    public actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await sleep(200);
    const keys = await this.storage.keys();
    this.orders = [];
    this.billedOrders = [];

    await asyncForeach(async (key) => {
      const order = await this.storage.get(key);
      if (order.state === 'FC') {
        this.orders.push(order);
      }
    }, keys);

    this.refresh();
    this.total = arraySum(this.orders.map((item) => item.buyedPrice));
  }

  trackByFunc(index, item) {
    return item ? item.id : index;
  }

  delete(id: string) {
    this.billedOrders = this.billedOrders.filter((item) => item.id !== id);
    this.total = arraySum(this.billedOrders.map((item) => item.buyedPrice));
  }

  refresh() {
    this.billedOrders = this.orders.slice();
  }

  async markLikePending(order) {
    order.state = 'PD';
    await this.storage.set(order.id, order);
    this.orders = this.orders.filter((item) => item.state === 'FC');
    this.billedOrders = this.billedOrders.filter((item) => item.state === 'FC');
    this.total = arraySum(this.billedOrders.map((item) => item.buyedPrice));
  }

  async save() {
    await new Promise((resolve) =>
      this.orders.forEach(async (item, idx) => {
        item.state = 'RB';
        item.deliveredDate = moment().format('YYYY-MM-DD HH:mm');
        await this.storage.set(item.id, item);

        if (idx === this.orders.length - 1) {
          resolve(true);
        }
      })
    );

    this.orders = this.orders.filter((item) => item.state === 'FC');
    this.refresh();

    const toast2 = await this.toastController.create({
      message: `Mercacia recibida con éxito`,
      duration: 2000,
      color: 'success',
    });
    toast2.present();
  }

  async presentActionSheet(order: Order) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Más opciones',
      buttons: [
        {
          text: 'Quitar de la lista',
          icon: 'trash',
          handler: () => {
            this.delete(order.id);
          },
        },
        {
          text: 'Marcar como pendiente',
          icon: 'hourglass',
          handler: async () => {
            await this.markLikePending(order);
          },
        },
      ],
    });
    await actionSheet.present();
    await actionSheet.onDidDismiss();
  }
}
