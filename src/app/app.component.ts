/* eslint-disable @typescript-eslint/naming-convention */
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  tabs = [
    { title: 'Pedidos', url: 'orders', icon: 'bag-check' },
    { title: 'Facturados', url: 'billing', icon: 'cash' },
    { title: 'Recibidos', url: 'received', icon: 'archive-outline' },
    { title: 'Ganancia', url: 'metrics', icon: 'pie-chart' },
  ];
  menus = [
    { title: 'Clientes', url: 'clients', icon: 'people' },
    { title: 'Acerca de', url: 'about', icon: 'information-circle-outline' },
  ];

  constructor(
    private platform: Platform,
    public alertController: AlertController
  ) {
    this.platform.backButton.subscribeWithPriority(-1, async () => {
      this.presentAlertConfirm();
    });
  }

  ngOnInit(): void {}

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Seguro que desea cerrar la app?',
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
        },
        {
          text: 'ACEPTAR',
          handler: () => {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            navigator['app'].exitApp();
          },
        },
      ],
    });

    await alert.present();
  }
}
