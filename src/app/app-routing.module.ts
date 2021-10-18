import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full',
  },
  {
    path: 'customer',
    loadChildren: () =>
      import('./pages/customer/customer.module').then(
        (m) => m.CustomerPageModule
      ),
  },
  {
    path: 'billing',
    loadChildren: () =>
      import('./pages/billing/billing.module').then((m) => m.BillingPageModule),
  },
  {
    path: 'metrics',
    loadChildren: () =>
      import('./pages/metrics/metrics.module').then((m) => m.MetricsPageModule),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./pages/orders/orders.module').then((m) => m.OrdersPageModule),
  },
  {
    path: 'received',
    loadChildren: () =>
      import('./pages/received/received.module').then(
        (m) => m.ReceivedPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
