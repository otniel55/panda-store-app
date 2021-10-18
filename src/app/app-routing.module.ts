import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full',
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
  {
    path: 'about',
    loadChildren: () =>
      import('./pages/about/about.module').then((m) => m.AboutPageModule),
  },
  {
    path: 'customer-detail',
    loadChildren: () =>
      import('./pages/customer-detail/customer-detail.module').then(
        (m) => m.CustomerDetailPageModule
      ),
  },
  {
    path: 'customers',
    loadChildren: () =>
      import('./pages/customers/customers.module').then(
        (m) => m.CustomersPageModule
      ),
  },
  {
    path: 'order-detail',
    loadChildren: () =>
      import('./pages/order-detail/order-detail.module').then(
        (m) => m.OrderDetailPageModule
      ),
  },
  {
    path: 'customer-form',
    loadChildren: () =>
      import('./pages/customer-form/customer-form.module').then(
        (m) => m.CustomerFormPageModule
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
