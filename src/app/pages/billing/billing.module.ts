import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { BillingPageRoutingModule } from './billing-routing.module';

import { BillingPage } from './billing.page';

@NgModule({
  imports: [CommonModule, IonicModule, BillingPageRoutingModule],
  declarations: [BillingPage],
})
export class BillingPageModule {}
