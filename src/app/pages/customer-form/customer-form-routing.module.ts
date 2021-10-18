import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerFormPage } from './customer-form.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerFormPageRoutingModule {}
