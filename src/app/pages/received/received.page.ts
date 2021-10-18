import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

import { StorageService } from 'src/app/services/storage.service';
import { Order } from 'src/app/shared/models/order';
import { asyncForeach } from 'src/app/shared/utils/arr';
import { sendWhatsapp } from 'src/app/shared/utils/send-ws';
import { sleep } from 'src/app/shared/utils/sleep';

@Component({
  selector: 'app-received',
  templateUrl: './received.page.html',
  styleUrls: ['./received.page.scss'],
})
export class ReceivedPage implements OnInit {
  orders: Order[] = [];

  constructor(
    private storage: StorageService,
    public actionSheetController: ActionSheetController
  ) {}

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

  async presentActionSheet(order: Order) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Más opciones',
      buttons: [
        {
          text: 'Enviar whatsapp',
          icon: 'logo-whatsapp',
          handler: async () => {
            sendWhatsapp({ phone: order.phone });
          },
        },
        {
          text: 'Marcar como entregado',
          icon: 'checkmark-circle-outline',
          handler: async () => {
            await this.markLikeDelivered(order);
          },
        },
        {
          text: 'Marcar como facturado',
          icon: 'cash',
          handler: async () => {
            await this.markLikeBilled(order);
          },
        },
      ],
    });
    await actionSheet.present();
    await actionSheet.onDidDismiss();
  }
}
