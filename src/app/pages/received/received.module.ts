import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ReceivedPageRoutingModule } from './received-routing.module';

import { ReceivedPage } from './received.page';

@NgModule({
  imports: [CommonModule, IonicModule, ReceivedPageRoutingModule],
  declarations: [ReceivedPage],
})
export class ReceivedPageModule {}
