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
  public appPages = [
    { title: 'Inicio', url: 'home', icon: 'home' },
    { title: 'Pedido', url: 'customer', icon: 'bag-check' },
    { title: 'Fac.', url: 'billing', icon: 'cash' },
    { title: 'Ganancia', url: 'metrics', icon: 'pie-chart' },
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
