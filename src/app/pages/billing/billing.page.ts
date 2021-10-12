import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { arraySum, asyncForeach } from 'src/app/shared/utils/arr';
import { sleep } from 'src/app/shared/utils/sleep';
import * as moment from 'moment';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.page.html',
  styleUrls: ['./billing.page.scss'],
})
export class BillingPage implements OnInit {
  orders: any[] = [];
  total = 0;

  constructor(
    private storage: StorageService,
    public toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await sleep(200);
    const keys = await this.storage.keys();
    this.orders = [];

    await asyncForeach(async (key) => {
      const order = await this.storage.get(key);
      if (order.state === 'PD') {
        this.orders.push(order);
      }
    }, keys);

    this.total = arraySum(this.orders.map((item) => item.buyedPrice));
  }

  trackByFunc(index, item) {
    return item ? item.id : index;
  }

  delete(id: string) {
    this.orders = this.orders.filter((item) => item.id !== id);
    this.total = arraySum(this.orders.map((item) => item.buyedPrice));
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

    const toast2 = await this.toastController.create({
      message: `Mercacia recibida con éxito`,
      duration: 2000,
      color: 'success',
    });
    toast2.present();

    await sleep(200);
    this.router.navigate(['/home']);
  }
}
