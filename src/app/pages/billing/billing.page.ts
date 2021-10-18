import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';
import * as moment from 'moment';

import { sleep } from 'src/app/shared/utils/sleep';
import { StorageService } from 'src/app/services/storage.service';
import { arraySum, asyncForeach } from 'src/app/shared/utils/arr';
import { Order } from './../../shared/models/order';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.page.html',
  styleUrls: ['./billing.page.scss'],
})
export class BillingPage implements OnInit {
  orders: Order[] = [];
  total = 0;

  constructor(
    private storage: StorageService,
    public toastController: ToastController,
    private router: Router,
    public actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await sleep(200);
    const keys = await this.storage.keys();
    this.orders = [];

    await asyncForeach(async (key) => {
      const order = await this.storage.get(key);
      if (order.state === 'FC') {
        this.orders.push(order);
      }
    }, keys);

    this.total = arraySum(this.orders.map((item) => item.buyedPrice));
  }

  trackByFunc(index, item) {
    return item ? item.id : index;
  }

  async presentActionSheet(order?: Order) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            console.log('Delete clicked');
          },
        },
        {
          text: 'Share',
          icon: 'share',
          handler: () => {
            console.log('Share clicked');
          },
        },
        {
          text: 'Play (open modal)',
          icon: 'caret-forward-circle',
          handler: () => {
            console.log('Play clicked');
          },
        },
        {
          text: 'Favorite',
          icon: 'heart',
          handler: () => {
            console.log('Favorite clicked');
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  delete(id: string) {
    this.orders = this.orders.filter((item) => item.id !== id);
    this.total = arraySum(this.orders.map((item) => item.buyedPrice));
  }

  // async markLikePending(order) {
  //   order.state = 'PD';
  //   await this.storage.set(order.id, order);
  //   const curentOrder = this.customers.find((item) => item.id === order.id);
  //   curentOrder.state = 'PD';
  //   this.setLists();
  // }

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

    const toast2 = await this.toastController.create({
      message: `Mercacia recibida con éxito`,
      duration: 2000,
      color: 'success',
    });
    toast2.present();

    await sleep(200);
    this.router.navigate(['/orders']);
  }
}
