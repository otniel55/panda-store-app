import { LOCALE_ID, NgModule } from '@angular/core';
import {
  BrowserModule,
  HammerGestureConfig,
  HammerModule,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
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

import { FileChooser } from '@ionic-native/file-chooser/ngx';

import * as Hammer from 'hammerjs';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

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
    HammerModule,
  ],
  providers: [
    FileChooser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es-VE' },
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
