import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

import { Customer } from 'src/app/shared/models/customer';
import { asyncForeach } from 'src/app/shared/utils/arr';
import { sendWhatsapp } from 'src/app/shared/utils/send-ws';
import { sleep } from 'src/app/shared/utils/sleep';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  customers: Customer[] = [];

  constructor(
    private storage: CustomerService,
    public actionSheetController: ActionSheetController,
    private router: Router
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await sleep(200);
    const keys = await this.storage.keys();
    this.customers = [];

    await asyncForeach(async (key) => {
      this.customers.push(await this.storage.get(key));
    }, keys);
  }

  trackByFunc(index, item) {
    return item ? item.id : index;
  }

  async presentActionSheet(customer: Customer) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Más opciones',
      buttons: [
        {
          text: 'Enviar whatsapp',
          icon: 'logo-whatsapp',
          handler: async () => {
            sendWhatsapp({ phone: customer.phone, msg: '' });
          },
        },
        {
          text: 'Llamar',
          icon: 'call-outline',
          handler: async () => {
            sendWhatsapp({ phone: customer.phone, msg: '' });
          },
        },
        {
          text: 'Editar',
          icon: 'create',
          handler: async () => {
            this.router.navigate(['/order-detail', customer.id]);
          },
        },
        {
          text: 'Ir al detalle',
          icon: 'file-tray-full-outline',
          handler: async () => {
            // await this.markLikeBilled(order);
          },
        },
        {
          text: 'Eliminar',
          icon: 'trash',
          handler: async () => {
            // await this.delete(order.id);
          },
        },
      ],
    });

    await actionSheet.present();
    await actionSheet.onDidDismiss();
  }
}
