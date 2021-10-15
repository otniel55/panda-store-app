import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { MetricsPageRoutingModule } from './metrics-routing.module';

import { MetricsPage } from './metrics.page';

@NgModule({
  imports: [CommonModule, IonicModule, MetricsPageRoutingModule],
  declarations: [MetricsPage],
})
export class MetricsPageModule {}
