import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
import { registerLocaleData } from '@angular/common';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import lcoaleESCO from '@angular/common/locales/es-VE';
registerLocaleData(lcoaleESCO);

import 'moment/min/locales';
import * as moment from 'moment';
moment.locale('es-ES');

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: '__pandastore',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es-VE' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
