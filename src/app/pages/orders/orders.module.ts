import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPage } from './orders.page';

@NgModule({
  imports: [CommonModule, IonicModule, OrdersPageRoutingModule],
  declarations: [OrdersPage],
})
export class OrdersPageModule {}
