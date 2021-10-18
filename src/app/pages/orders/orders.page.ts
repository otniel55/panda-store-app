import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

import { StorageService } from 'src/app/services/storage.service';
import { Order } from 'src/app/shared/models/order';
import { asyncForeach } from 'src/app/shared/utils/arr';
import { sendWhatsapp } from 'src/app/shared/utils/send-ws';
import { sleep } from 'src/app/shared/utils/sleep';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  orders: Order[] = [];

  constructor(
    private storage: StorageService,
    public actionSheetController: ActionSheetController,
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
  }

  trackByFunc(index, item) {
    return item ? item.id : index;
  }

  async delete(id: string) {
    await this.storage.delete(id);
    this.orders = this.orders.filter((item) => item.id !== id);
  }

  async markLikeBilled(order) {
    order.state = 'FC';
    await this.storage.set(order.id, order);
    this.orders = this.orders.filter((item) => item.state === 'PD');
  }

  async presentActionSheet(order: Order) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Más opciones',
      buttons: [
        {
          text: 'Enviar whatsapp',
          icon: 'logo-whatsapp',
          handler: async () => {
            sendWhatsapp({ phone: order.phone, msg: '' });
          },
        },
        {
          text: 'Editar',
          icon: 'create',
          handler: async () => {
            this.router.navigate(['customer', order.id]);
          },
        },
        {
          text: 'Marcar como facturado',
          icon: 'cash',
          handler: async () => {
            await this.markLikeBilled(order);
          },
        },
        {
          text: 'Eliminar',
          icon: 'trash',
          handler: async () => {
            await this.delete(order.id);
          },
        },
      ],
    });

    await actionSheet.present();
    await actionSheet.onDidDismiss();
  }
}
